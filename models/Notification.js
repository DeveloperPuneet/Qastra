const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    Read: {
        type: Boolean,
        default: false
    },
    Type: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    NotifyTo: {
        type: String,
        default: ""
    },
    Date: {
        type: Number
    },
    Expire: {
        type: Number
    }
});

module.exports = mongoose.model('Notification', schema);