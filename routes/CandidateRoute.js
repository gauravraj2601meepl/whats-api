
const express = require("express");
const Candidate_Module = require("../models/WhatsappBusiness/Candidate");
const candidateRouter = express.Router();


candidateRouter.get("/", async (req, res) => {
    try {
        const candidate_data = await Candidate_Module.find();
        res.status(200).json(candidate_data);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports= {candidateRouter}