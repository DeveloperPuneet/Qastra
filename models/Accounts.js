const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true,
        unique: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    verification: {
        type: Boolean,
        default: false
    },
    Token: {
        type: String,
        default: ''
    },
    Identity: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Account', schema);