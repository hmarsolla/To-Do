const chai = require("chai");
const request = require("supertest");
const expect = chai.expect;
const {ObjectID} = require("mongodb");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");
const {todos, users, populateTodos, populateUsers} = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        var text = "Test todo text";

        request(app)
            .post("/todos")
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).to.equal(text);
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).to.equal(1);
                    expect(todos[0].text).to.equal(text);
                    done();
                }).catch((e) => done(e));
            })
    }); 

    it("should not create a new todo", (done) => {
        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err, res)=>{
                if(err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).to.equal(2);
                    done();
                }).catch((e) => done(e));
            })
    }); 
});

describe("GET /todos", () => {
    it("should get all todos", (done) => {
        request(app)
            .get("/todos")
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).to.equal(2);
            })
            .end(done);
    });
});

describe("GET /todos/:id", () => {
    it("should return todo doc", (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).to.equal(todos[0].text);
            })
            .end(done);
    });

    it("should return 404 if todo not found", (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    })

    it("should return 404 if objectid is not valid", (done) => {
        request(app)
            .get("/todos/123abc")
            .expect(404)
            .end(done);
    })
    
});

describe("DELETE /todos/:id", () => {
    it("should remove a todo", (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).to.equal(hexId);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).to.not.exist;
                    done();
                }).catch((e) => done(e));
                
            });
    });

    it("should return 404 if todo not found", (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);  
    });

    it("should return 404 if objectid is not valid", (done) => {
        request(app)
            .delete("/todos/123abc")
            .expect(404)
            .end(done);
    })
});

describe("PATCH /todos/:id", () => {
   it("should update a todo", (done) => {
        var hexId = todos[0]._id.toHexString();
        var rd = Math.floor((Math.random() * 10) + 1);        
        var body = {text : `Text is changed: ${rd}`, completed : true};

        request(app)
            .patch(`/todos/${hexId}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).to.equal(body.text);
                expect(res.body.todo.completed).to.equal(body.completed);
                expect(res.body.todo.completedAt).to.be.a("number");
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).to.equal(body.text);
                    expect(todo.completed).to.equal(body.completed);
                    done();
                }).catch((e) => done(e));
            });
   });

   it("should clear completedAt when todo is not completed", (done) => {
        var hexId = todos[0]._id.toHexString();
        var body = {completed : false};

        request(app)
            .patch(`/todos/${hexId}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).to.equal(false);
                expect(res.body.todo.completedAt).to.equal(null);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo.completed).to.equal(false);
                    expect(todo.completedAt).to.equal(null);
                    done();
                }).catch((e) => done(e));
            });
   });
   
   it("should return 404 if todo not found", (done) => {
        request(app)
            .patch(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);  
   });

   it("should return 404 if objectid is not valid", (done) => {
        request(app)
            .patch("/todos/123abc")
            .expect(404)
            .end(done);
   });
});

describe("GET /users/me", () => {
    it("should return user if authenticated", (done) => {
        request(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).to.equal(users[0]._id.toHexString());
                expect(res.body.email).to.equal(users[0].email);
            })
            .end(done);
    });

    it("should return 401 if not authenticated", (done) => {
        request(app)
            .get("/users/me")
            .expect(401)
            .expect((res) => {
                expect(res.body).to.be.empty;
            })
            .end(done);
    });
});

describe("POST /users", () => {
    it("should create a user", (done) => {
        var email = "example@example.com";
        var password = "123mnb!";

        request(app)
            .post("/users")
            .send({email,password})
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).to.exist;
                expect(res.body._id).to.exist;
                expect(res.body.email).to.equal(email);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).to.exist;
                    expect(user.password).to.not.equal(password);
                    done();
                })
            })
    });

    it("should return validation errors if request is invalid", (done) => {
        var email = "example";
        var password = "123!";

        request(app)
            .post("/users")
            .send({email,password})
            .expect(400)
            .end(done);
    });

    it("should not create user if email is already in database", (done) => {
        var email = users[0].email;
        var password = "123mnb!";

        request(app)
            .post("/users")
            .send({email,password})
            .expect(400)
            .end(done);
    });
});