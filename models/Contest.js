const mongoose = require("mongoose");


const contestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: String
    },
    participants: [{
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true
        }
    }]
});

const Contest =mongoose.model("Contest", contestSchema);


module.exports = Contest;