const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema ( {
    ID: {
        type:String
    },
    PostID: {
        type:String
    },
    Answer: {
        type:String
    },
    CreatedAt: {
        type: Date,
        default: Date.now(),
      }
    
});

const CommentData = mongoose.model('comment',commentSchema);
module.exports = CommentData;