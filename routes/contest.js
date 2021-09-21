const mongoose = require("mongoose");
const verify = require("../middlewares/verify");
const express = require("express");
const Contest = require("../models/Contest");


const contestRouter = express.Router();

contestRouter.post("/create", createContest).post("/addParticipant", addParticipant);


async function createContest(req, res) {
    try {
        const name = req.body.name;
        const date = req.body.date;

        const contest = await Contest.create({
            name: name,
            date: date,
        });
        if (contest) {
            contest.save();
            return res.status(200).json({
                message: "Contest created successfully"
            });
        } else {
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
        const contest = await Contest.findOne({
            name: req.body.name
        });

        if (contest) {
            const participants = req.body.participants;

            const result = await Contest.updateMany({
                name: contest.name
            }, {
                $push: {
                    participants: {$each:participants,sort:-1}
                }
            });
            if (result) {
                console.log("Participants added successfully");
                return res.status(200).json({
                    message: "participants added successfully"
                })
            } else {
                return res.status(400).json({
                    message: "failed to add participants"
                });
            }
        } else {
            console.log("Contest not found!");
        }
    } catch (error) {
        return res.status(500).json({
            message: "failed to add participants, internal server error",
            error: error
        })
    }
}

module.exports = contestRouter;