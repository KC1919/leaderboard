const verify = require("../middlewares/verify");
const express = require("express");
const Contest = require("../models/Contest");
const mongoose = require("mongoose");
const ejs = require('ejs');
const Cumulative = require("../models/cumulative");
const axios=require("axios");


const contestRouter = express.Router();

contestRouter.post("/create", createContest).get("/allContests", getContests).get("/participants",verify, getParticipants);


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

//function to display all the participants on the leaderboard in descsending order of their score
async function getParticipants(req, res) {

    try {
        const participants = await Cumulative.find({}, {
            _id: 0
        }).sort({
            score: -1
        });

        if (participants !== null) {
            // console.log(participants);
           res.render("leaderboard.ejs",{participants:participants});
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

contestRouter.get("/addParticipant",verify, addParticipant).post("/updateCumulative",verify, updateCumulative);

//function to add participants to the cumulative leaderboard list
async function updateCumulative(req, res) {

    try {
        let count=0;
        const data = req.body;

        // console.log(req.body);
		
		//looping through all the participants to be added to the participants list
        await data.forEach(async (participant) => {
			
			//finding if the participant already exist in the database
            const present = await Cumulative.findOne({
                regNumber: participant.regNumber
            }, {
                _id: 0
            });
			
			//if the participant exists
            if (present !== null) {
                const prevScore = present.score;   //we take his previous score stored in the database
                const newScore = await (prevScore + parseInt(participant.score));   //sum the previous score witht the current obtained score
                const update = await Cumulative.updateOne({    //and update the score with the new score formed by summing up thte prev and current
                    regNumber: present.regNumber
                }, {
                    score: newScore,
                });

                if (update !== null) {
                    count++;
                    console.log("Score updated successfully");
                    // return res.json("Scores updated successfully");
                } else {
                    console.log("Problem updating score!");
                }
            } else {  //if the participant is not present in the database, means this is the first time participant has participated in the contest
                const newParticipant = await Cumulative.create(participant);  //so we create a new participant, with the obtained score
                if (newParticipant) {
                    await newParticipant.save();
                    count++;
                    console.log("New participant scores updated successfully!");
                    // return res.json("New Participant added successfully");
                } else {
                    console.log("Error saving the score of new Participant");
                }
            }
        });
        if(count===data.length){
            res.redirect("/participants");
        }
        
    } catch (error) {
        console.log("Internal server error", error);
        return res.status(500).json({
            message: "Error updating cumulative scores,internal server error",
            error: error
        });
    }
}

//function to render the page where participants can be added
async function addParticipant(req, res) {
    res.render("cumulativeAdd");
}

contestRouter.post("/participants/delete",deleteParticipant);

//function to delete a participant from the leaderboard
async function deleteParticipant(req,res) {
    
    try {
        // console.log(req.body.regNumber);
        const result=await Cumulative.findOneAndDelete({regNumber:req.body.regNumber});
        if(result!=null){
            console.log("Participant deleted successfully!");
            return res.status(200).json({message:"Deleted successfully"});
        }else{
            console.log("Failed to delete partcipant");
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = contestRouter;