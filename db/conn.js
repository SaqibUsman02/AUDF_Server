const mongoose = require('mongoose');
require('dotenv').config()


const DB = process.env.DATABASE;

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection Successful");
}).catch((err) => console.log("No Connection " + err));