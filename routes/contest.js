const verify = require("../middlewares/verify");
const express = require("express");
const Contest = require("../models/Contest");
const mongoose = require("mongoose");
const ejs = require('ejs');
const Cumulative = require("../models/cumulative");


const contestRouter = express.Router();

contestRouter.post("/create", createContest).get("/allContests", getContests).get("/cumulative", cumulative);


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
            res.render("contests", {
                contests: contests
            })
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


async function cumulative(req, res) {

    try {
        const cumScore = await Cumulative.find({}, {
            _id: 0
        }).sort({
            score: -1
        });

        if (cumScore !== null) {
            console.log(cumScore);
            return res.status(200).json({
                message: "Cumulative scores fetched!",
                result: cumScore
            });
        } else {
            return res.status(400).json({
                message: "Error fetching cumulative score!"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error fetching cumulative score, internal server error",
            result: error
        });
    }
}

contestRouter.post("/addCumulative", addCumulative);

async function addCumulative(req, res) {

    try {
        const data = req.body;

        data.forEach(async (participant) => {
            const present = await Cumulative.findOne({
                email: participant.email
            }, {
                _id: 0
            });

            if (present !== null) {
                const prevScore = present.score;
                const newScore = await (prevScore + participant.score);
                const update = await Cumulative.updateOne({
                    email: present.email
                }, {
                    score: newScore,
                });

                if (update !== null) {
                    console.log("Score updated successfully");
                } else {
                    console.log("Problem updating score!");
                }
            } else {
                const newParticipant = await Cumulative.create(participant);

                if (newParticipant) {
                    newParticipant.save();
                    console.log("New participant scores updated successfully!");
                } else {
                    console.log("Error saving the score of new Participant");
                }
            }
        });
    } catch (error) {
        console.log("Internal server error", error);
        return res.status(500).json({
            message: "Error updating cumulative scores,internal server error",
            error: error
        });
    }
}

module.exports = contestRouter;