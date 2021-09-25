const express = require("express");
const app = express();
const db = require("./db");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(express.static("public"));

app.set('view engine','ejs');

app.use(cookieParser());

app.use(express.json());

// app.post("/auth/login",(req,res)=>{
//     console.log(req.body.email);
// })


const authRouter = require("./routes/auth");
const contestRouter = require("./routes/contest");
const crudRouter = require("./routes/crud");

app.use("/auth", authRouter);
app.use("/contest", contestRouter);
app.use("/contest/crud", crudRouter);

app.get("/",(req,res)=>{
    res.render("login");
});


app.listen(3000, () => {
    console.log("Server started");
    db();
});