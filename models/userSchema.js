const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    Email: {
        type: String,
    },
    Password: {
        type: String,
        
    },
    Confirm_Password: {
        type: String,
    },
    Photo:{
        type: String,
    },
    Date:{
        type: Date,
        default:Date.now
    },
    Tokens: [
        {
            token: {
                type: String,
            }
        }
    ],
    verified: {
        type: Boolean,
        default: false
    },
    Category: {
        type: String,
        default: "",
    },
    Phone: {
        type: String,
        default: "",
    },
    Gender: {
        type: String,
        default: "",
    },
    Website: {
        type: String,
        default: "",
    },
    Github: {
        type: String,
        default: "",
    },
    Twitter: {
        type: String,
        default: "",
    },
  
    

})

//---------Hashing Password

userSchema.pre('save',async function(next) {
if(this.isModified('Password'))
{
    this.Password = await bcrypt.hash(this.Password,12);
    this.Confirm_Password= await bcrypt.hash(this.Confirm_Password,12);

}
next();
});

// Generating Token------
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id}, process.env.SECRET_KEY);
        this.Tokens = this.Tokens.concat({token: token});
        await this.save();
        return token;

    } catch(err){
        console.log(err);
    }
}


// storing a mesage contact forum

    

    userSchema.methods.addMessage = async function (name,Email,Message) {
        try {
            console.log('=======-=-=-=-------------============-----------');
            this.messages = this.messages.concat({name,Email,Message});
            await this.save();
            return this.messages;

        }catch(err){
            console.log(err);
        }
    } 




const User = mongoose.model('USER', userSchema);
module.exports = User;