const mongoose = require("mongoose");

const time=()=>{
    let date=new Date();
    date.toString('YYYY-MM-dd');
}

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
},{timestamps:true});

const Cumulative = mongoose.model("Cumulative", cumulativeSchema);

module.exports = Cumulative;