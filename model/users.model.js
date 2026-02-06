const mongoose = require("mongoose");
const validator = require("validator");
const userRole = require("../utils/roleUser");

const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [userRole.USER, userRole.ADMIN, userRole.MANGER],
        default: userRole.USER
    },
    avatar: {
        type: String,
        default: 'uploads/profile.png'
    },
});

module.exports = mongoose.model('User', usersSchema);