const express = require("express");
const app = express();
const db = require("./db");
const cookieParser = require("cookie-parser");
const ejs=require("ejs");
require("dotenv").config();

app.use(express.static("public"));

app.set('view engine','ejs');

app.use(cookieParser());

app.use(express.json());

const authRouter = require("./routes/auth");
const contestRouter = require("./routes/contest");
const crudRouter = require("./routes/crud");

app.use("/api/auth", authRouter);
app.use("/api/contest", contestRouter);
app.use("/api/contest/crud", crudRouter);




app.listen(3000, () => {
    console.log("Server started");
    db();
});