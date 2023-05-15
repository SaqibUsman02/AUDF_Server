const mongoose = require("mongoose");


const contactSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    Email: {
        type: String,
    },
    Subject: {
        type: String,

},  
    Message: {
        type: String,

},   
    Date:{
        type: Date,
        default:Date.now
    },
    

})



const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;