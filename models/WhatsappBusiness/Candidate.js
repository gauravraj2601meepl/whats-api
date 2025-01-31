const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    gender: String,
    mobile: String,
    email: String,
    birthDate: String,
    share_id: String,
    workspace: String
}, {
    timestamps: true
});

const Candidate_Module = mongoose.model("Candidate", userSchema);

module.exports = Candidate_Module;
