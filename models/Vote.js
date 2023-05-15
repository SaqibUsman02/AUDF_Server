const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema ( {
    UserID: {
        type:String
    },
    PostID: {
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

const VoteData = mongoose.model('vote',VoteSchema);
module.exports = VoteData;