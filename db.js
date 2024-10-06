const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGODB_URL_LOCAL//Replace my database with your database name 

//set up mongodb connection
mongoose.connect(mongoURL);
    

const db = mongoose.connection;
//define event listener

db.on('connected' , () =>{
    console.log("connected to MongoDb server");
});

db.on('error', (err) => {
    console.log("MongoDB connection error" ,err);
});

db.on('disconnected', () => {
    console.log("MongoDB disconnected");
});

//export db connection

module.exports = db;
