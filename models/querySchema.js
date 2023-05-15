const mongoose = require('mongoose');

const querySchema = mongoose.Schema({

    
    UserID: {
        type:String
    },
    UserName: {
        type: String
    },
    PostID: {
        type:String
    },
    QueryCategory: {
        type:String
    },
    QueryTitle: {
        type:String
    },
    QueryDetails: {
        type:String
    },
    QueryTags: {
        type: String
      },
    Date: {
        type: Date,
        default: Date.now(),
      },
    Upvote: {
        type: Number,
        default: 0,
    },

    Devote: {
        type: Number,
        default: 0,
    },

    // Comment: {
    //     type: Number,
    //     default: 0,
    // },
    Comment: [
        {
            Photo: {
                type:String
            },
            ID: {
                type:String
            },
            Name:{
                type: String
            },
            PostID: {
                type:String
            },
            comment: {
                type:String
            },
            Upvote: {
                type: Number,
                default: 0,
            },
        
            Devote: {
                type: Number,
                default: 0,
            },
            CreatedAt: {
                type: Date,
                default: Date.now(),
              }
        }
    ],
     
},{
    collection: 'Queries'
  });

// querySchema.methods.addQuery= async function (ID,PostID,Category,Title,Detail,Tags) {
//     try {
//         console.log('=======-=-=-=-------------============-----------');
//         this.ID = this.ID.concat({ID,PostID,Category,Title,Detail,Tags});
//         await this.save();
//         return this.ID;

//     }catch(err){
//         console.log(err);
//     }
// } 
// querySchema.methods.commentManipulation= async function () {
//     try {
//         let comment = jwt.sign({ _id: this._id}, process.env.SECRET_KEY);
//         this.Comment = this.Comment.concat({comment: comment});
//         await this.save();
//         return comment;

//     } catch(err){
//         console.log(err);
//     }
// }

querySchema.methods.addMessage = async function (Photo,ID,Name,PostID,comment) {
    try {
        console.log('=======-=-=-=-------------============-----------');
        this.Comment = this.Comment.concat({Photo,ID,Name,PostID,comment});
        await this.save();
        return this.Comment;

    }catch(err){
        console.log(err);
    }
} 

const QueryData = mongoose.model('Queries', querySchema);
module.exports= QueryData;