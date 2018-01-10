var mongoose = require("mongoose");
var {config} = require("./../config.js");

mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp", { useMongoClient: true });
mongoose.connect(config.connectionString, { useMongoClient: true });


module.exports = {mongoose};