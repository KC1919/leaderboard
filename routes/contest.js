const mongoose = require("mongoose");
const verify = require("../middlewares/verify");
const express = require("express");
const Contest = require("../models/Contest");


const contestRouter = express.Router();

contestRouter.post("/create", createContest).post("/addParticipant", addParticipant);


//function to create a new contest
async function createContest(req, res) {
    try {
        const name = req.body.name; //name of the contest
        const date = req.body.date; //tentative date of the contest

        //creating the contest
        const contest = await Contest.create({
            name: name,
            date: date,
        });
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

async function addParticipant(req, res) {

    try {
        //we check if the contest is present in the database or not
        const contest = await Contest.findOne({
            name: req.body.name
        });

        if (contest) {
            //if the contest is already present in the database
            const participants = req.body.participants; //we get the participants list
            
            //we add all the participants to the participants array of that particular contest
            const result = await Contest.updateMany({
                name: contest.name
            }, {
                $push: {
                    participants: {
                        $each: participants,
                        sort: 1
                    }
                }
            });
            //if the participants get added successfully
            if (result) {
                console.log("Participants added successfully");
                return res.status(200).json({
                    message: "participants added successfully"
                });
            } else {
                return res.status(400).json({
                    message: "failed to add participants"
                });
            }
        } 
        
        //and if the contest is not present in the database
        else {
            // console.log("Contest not found!");

            const name = req.body.name;
            const date = new Date(Date.now()).toLocaleString();

            //then we first create the contest 
            const contest = await Contest.create({
                name: name,
                date: date,
            });

            if (contest) {
                contest.save();//then save the contest in the database

                const participants = req.body.participants; //we get the participants list

                //we add the participants to the contest
                const result = await Contest.updateMany({
                    name: contest.name
                }, {
                    $push: {
                        participants: {
                            $each: participants,
                            $sort: {
                                score: -1
                            }
                        }
                    }
                });
                if (result) {
                    console.log("Participants added successfully");
                    return res.status(200).json({
                        message: "Contest created and participants added successfully"
                    })
                } 
                else {
                    return res.status(400).json({
                        message: "failed to add participants"
                    });
                }
            } else {
                return res.status(200).json({
                    message: "Failed to create contest"
                });
            }
        }
        
    } catch (error) {
        return res.status(500).json({
            message: "failed to add participants, internal server error",
            error: error
        })
    }
}

module.exports = contestRouter;