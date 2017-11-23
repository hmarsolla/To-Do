const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) =>{
    if(err) return console.log("Unable to connect to MongoDB Server");
    console.log("Connected to MongoDB server");

    // db.collection("ToDos").insertOne({
    //     text: "Something to do",
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log("Unable to insert ToDo", err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });


    db.collection("Users").insertOne({
        name: "Heitor",
        age: 21,
        location: "Brazil"
    }, (err, result) => {
        if(err){
            return console.log("Unable to insert User", err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    

    db.close();
});