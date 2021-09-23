const mongoose = require("mongoose");

const cumulativeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
});

const Cumulative = mongoose.model("Cumulative", cumulativeSchema);

module.exports = Cumulative;