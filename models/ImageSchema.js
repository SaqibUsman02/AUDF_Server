const mongoose = require("mongoose");


const ImageSchema = new mongoose.Schema({
   
    // postImage: String ,
    // Title : String,
    postImage: {
        type:String
    },
    Title: {
        type:String
    },
});




const UserImage = mongoose.model('Image', ImageSchema);
module.exports = UserImage;