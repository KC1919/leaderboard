const mongoose = require("mongoose");

const Contest=require("./models/Contest");
const User=require("./models/User");


async function connect() {
    try {
        const result = await mongoose.connect(process.env.DB_URL);
        console.log("DB connected successfully");
    } catch (error) {
        console.log("Failed to connect to the DB", error);
    }
};

module.exports=connect;