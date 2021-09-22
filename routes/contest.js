const verify = require("../middlewares/verify");
const express = require("express");
const Contest = require("../models/Contest");
const mongoose=require("mongoose");
const ejs=require('ejs');


const contestRouter = express.Router();

contestRouter.post("/create", createContest).get("/allContests", getContests);


//function to create a new contest
async function createContest(req, res) {
    try {
        const name = req.body.name; //name of the contest
        const date = req.body.date; //tentative date of the contest

        //creating the contest
        const contest = await Contest.create({
            name: req.body.name,
            date: req.body.date
        });
        // console.log("below");
        if (contest) {
            //if the contest got created successfully
            contest.save(); //we save the contest in the database
            return res.status(200).json({
                message: "Contest created successfully"
            });
        } else {
            //else we return error to the user
            return res.status(400).json({
                message: "failed to create the contest"
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Failed to create the contest,Internal server error",
            error: error
        });
    }
}



async function getContests(req, res) {
    try {
        const contests = await Contest.find({}, {
            _id: 0,
        });
        if (contests.length > 0) {
            res.render("contests",{contests:contests})
            // return res.status(200).json({
            //     message: "Contests fetched successfully",contests:contests
            // });
        } else {
            return res.status(400).json({
                message: "Contests cannot be fetched"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Contests cannot be fetched, internal server error"
        });
    }
}

module.exports = contestRouter;