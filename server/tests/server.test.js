const chai = require("chai");
const request = require("supertest");
const expect = chai.expect;
const {ObjectID} = require("mongodb");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo");

const todos = [{
    _id: new ObjectID(),
    text: "First test todo"
}, {
    _id: new ObjectID(),
    text: "Second test todo"
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
})

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
