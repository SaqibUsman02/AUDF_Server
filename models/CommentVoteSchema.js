const mongoose = require('mongoose');

const CommentVoteSchema = new mongoose.Schema ( {
    UserID: {
        type:String
    },
    PostID: {
        type:String
    },
    CommentID: {
        type:String
    },
    Type: {
        type:String
    },
    VotedAt: {
        type: Date,
        default: Date.now(),
      }
    
});

const CommentVoteData = mongoose.model('Comment Vote',CommentVoteSchema);
module.exports = CommentVoteData;