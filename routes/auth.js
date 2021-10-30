const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const verify = require("../middlewares/verify");


app.use(express.json());

authRouter.post("/login", login).post("/register", register).get("/protected", verify, protected).post("/logout",verify,logout);

async function login(req, res) {

    try {
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email: email
        });

        if (user !== null) {
            const pass = await bcrypt.compare(password, user.password);
            if (user.email === email && pass) {
                console.log("User authenticated");
                const authToken = jwt.sign({userId:user._id}, process.env.JWT_KEY);
                await res.cookie("secret", authToken, {
                    httpOnly: true,
                    maxAge: 864000
                });
                return res.json("Participants added successfully!");
            } else {
                return res.status(200).json({
                    message: "Invalid email or password"
                });
            }

        } else {
            console.log("User not found");
            return res.status(401).json({
                message: "User does not exists!"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: "Internal server error",
            error: error
        });
    }
}

// funtion to register a user
async function register(req, res) {

    try {
        const {
            email,
            password
        } = req.body;

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);
        const user = await User.create({
            email: email,
            password: secPass
        });
        if (user) {
            console.log("User created successfully");
            return res.status(200).json({
                message: "User created"
            });
        }
    } catch (error) {
        console.log("Registration failed");
        return res.status(400).json({
            message: "User creation failed",
            error
        });
    }
}

//function to Logout a user
async function logout(req,res){
    
    //destroying the cookie, by setting its age to 0
    res.cookie('secret', '', {
        maxAge: 0,
        overwrite: true,
      });
    res.redirect("/");
}


function protected(req, res) {
    console.log("reached protected");
    return res.status(200).json({
        message: "Reached protected"
    });
}


module.exports = authRouter;