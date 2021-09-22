const express = require("express");
const mongoose = require("mongoose");
const Contest = require("../models/Contest");

express().use(express.json());

const crudRouter = express.Router();

crudRouter.post("/update").post("/:contestName/addParticipants", addParticipant).post("/:contestName/participants/delete", deleteParticipant).get("/:contestName/participants", getParticipants);

async function deleteParticipant(req, res) {

    try {
        const contest = req.params.contestName; //extracted the contest name from which the participant is to be deleted
        const email = req.body.email; //the email of the participant to be deleted

        console.log(contest, email);
        console.log(contest);

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

async function getParticipants(req, res) {
    try {
        let contest = req.params.contestName;
        const participants = await Contest.find({
            name: req.params.contestName
        }, {
            _id: 0,
            participants: 1
        });

        if (participants.length > 0) {
            // console.log(participants[0].participants);
            res.render("participants", {
                contest: contest,
                participants: participants[0].participants
            });
            // return res.status(200).json({message:"participants fetched successfully",result:participants});
        } else {
            return res.status(400).json({
                message: "participants not found"
            });
        }
    } catch (error) {
        console.log(err);
        return res.status(500).json({
            message: "participants not found, internal server error"
        });
    }
}



// function to add participants
async function addParticipant(req, res) {

    try {
        
        console.log("hello");
        console.log(req.params.contestName);
        console.log(req.body.name);
        //we check if the contest is present in the database or not
        // const contest = await Contest.findOne({
        //     name: req.body.params
        // });

        // if (contest) {
        //     //if the contest is already present in the database
        //     const participants = req.body.participants; //we get the participants list

        //     //we add all the participants to the participants array of that particular contest
        //     const result = await Contest.updateMany({
        //         name: contest.name
        //     }, {
        //         $push: {
        //             participants: {
        //                 $each: participants,
        //                 $sort: {
        //                     score: -1
        //                 }
        //             }
        //         }
        //     });
        //     //if the participants get added successfully
        //     if (result) {
        //         console.log("Participants added successfully");
        //         return res.status(200).json({
        //             message: "participants added successfully"
        //         });
        //     } else {
        //         return res.status(400).json({
        //             message: "failed to add participants"
        //         });
        //     }
        // }

        //and if the contest is not present in the database
        // else {
        //     // console.log("Contest not found!");

        //     const name = req.body.name;
        //     const date = new Date(Date.now()).toLocaleString();

        //     //then we first create the contest 
        //     const contest = await Contest.create({
        //         name: name,
        //         date: date,
        //     });

        //     if (contest) {
        //         contest.save(); //then save the contest in the database

        //         const participants = req.body.participants; //we get the participants list

        //         //we add the participants to the contest
        //         const result = await Contest.updateMany({
        //             name: contest.name
        //         }, {
        //             $push: {
        //                 participants: {
        //                     $each: participants,
        //                     $sort: {
        //                         score: -1
        //                     }
        //                 }
        //             }
        //         });
        //         if (result) {
        //             console.log("Participants added successfully");
        //             return res.status(200).json({
        //                 message: "Contest created and participants added successfully"
        //             })
        //         } else {
        //             return res.status(400).json({
        //                 message: "failed to add participants"
        //             });
        //         }
        //     } else {
        //         return res.status(200).json({
        //             message: "Failed to create contest"
        //         });
        //     }
        // }

    } catch (error) {
        return res.status(500).json({
            message: "failed to add participants, internal server error",
            error: error
        })
    }
}


crudRouter.get("/:contestName/addParticipant",addPartiForm);

async function addPartiForm(req,res){
    res.render("addParticipants",{contest:req.params.contestName});
}


module.exports = crudRouter;