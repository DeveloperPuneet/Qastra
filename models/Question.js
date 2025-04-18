const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    Topic: {
        type: String,
        required: true
    },
    Question: {
        type: String
    },
    Saved: {
        type: Array,
        default: []
    },
    Date: {
        type: Number,
    },
    QID: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Question', schema);