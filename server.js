const express = require("express");
const app = express();
const db = require("./db");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const jwt = require("jsonwebtoken");

app.use(cookieParser());

app.use(express.json());

const authRouter = require("./routes/auth");
const contestRouter = require("./routes/contest");

app.use("/api/auth", authRouter);
app.use("/api/contest", contestRouter);



app.listen(3000, () => {
    console.log("Server started");
    db();
});
