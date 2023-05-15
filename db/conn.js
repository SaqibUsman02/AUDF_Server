const mongoose = require('mongoose');
require('dotenv').config()


const DB = process.env.DATABASE;

mongoose.connect('mongodb+srv://discussionforum:discussionforum@cluster0.chjaowf.mongodb.net/discussionforum?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection Successful");
}).catch((err) => console.log("No Connection " + err));