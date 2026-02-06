const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Course', coursesSchema);