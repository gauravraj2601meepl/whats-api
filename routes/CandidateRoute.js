
const express = require("express");
const Candidate_Module = require("../models/WhatsappBusiness/Candidate2");
const Location_Module = require("../models/Location/Location2");
const candidateRouter = express.Router();


candidateRouter.get("/candidate", async (req, res) => {
    try {
        const candidate_data = await Candidate_Module.find();
        res.status(200).json(candidate_data);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
candidateRouter.get("/location", async (req, res) => {
    try {
        const location_data = await Location_Module.find();
        res.status(200).json(location_data);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports= {candidateRouter}