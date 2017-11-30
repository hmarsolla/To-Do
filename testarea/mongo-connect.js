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

    // db.collection("Users").insertOne({
    //     name: "Heitor",
    //     age: 21,
    //     location: "Brazil"
    // }, (err, result) => {
    //     if(err){
    //         return console.log("Unable to insert User", err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection("ToDos").find({"completed": false}).toArray().then((docs) => {
    //     console.log("ToDos:");
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) =>{
    //     console.log("Unable to fetch todos", err);
    // });

    // db.collection("ToDos").deleteMany({text: "Eat lunch"}).then((result) =>{
    //     console.log(result.result.ok);
    // });

    // db.collection("ToDos").deleteOne({text: "Eat lunch"}).then((result) => {
    //     console.log(result);
    // });

    // db.collection("ToDos").findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // });

    // db.collection("ToDos").findOneAndUpdate({
    //     _id: new ObjectID("5a1870d205e376e6c5527106")
    // }, {
    //     $set:{ completed: true}
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    db.close();
});