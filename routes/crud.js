const express = require("express");
const mongoose=require("mongoose");
const Contest = require("../models/Contest");

const crudRouter = express.Router();

crudRouter.post("/update").delete("/:contestName/delete", deleteParticipant);

async function deleteParticipant(req, res) {

    try {
        const contest = req.params.contestName;  //extracted the contest name from which the participant is to be deleted
        const email = req.body.email; //the email of the participant to be deleted

        // console.log(contest);

        //deleting the participant
        const result = await Contest.findOneAndUpdate({
            name: contest
        }, {
            $pull: {
                participants: {
                    email: email
                }
            }
        });

        if (result) {
            console.log("Participant deleted successfully");
            return res.status(200).json({
                message: "Participant deleted successully"
            });
        } else {
            return res.status(400).json({
                message: "Participant cannot be deleted"
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Participant cannot be deleted, internal server error",
            error: error
        });
    }
}

module.exports = crudRouter;