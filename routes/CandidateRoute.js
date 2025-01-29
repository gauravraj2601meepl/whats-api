
const express = require("express");
const Candidate = require("../model/candidate.model");

const candidateRouter = express.Router();


candidateRouter.get("/", async (req, res) => {
    try {
        const candidate_data = await Candidate.find();
        res.status(200).json(candidate_data);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports= {candidateRouter}