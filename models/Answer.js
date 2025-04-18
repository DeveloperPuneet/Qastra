const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    Answer: {
        type: String,
        required: true
    },
    Date: {
        type: Number,
    },
    AID: {
        type: String,
        required: true
    },
    QID:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Answer', schema);