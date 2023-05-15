const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema ( {
    ID: {
        type:String
    },
    Category: {
        type:String
    },
    Feedback: {
        type:String
    },
    Review: {
        type:String
    }
});

const FeedbackData = mongoose.model('feedback',feedbackSchema);
module.exports = FeedbackData;