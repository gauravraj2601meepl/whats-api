const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {type:String, required: true},
    lastName: String,
    gender: String,
    mobile: String,
    email: {type:String, required: true},
    birthDate: String,
    share_id: String,
    workspace: {type:String, required: true}
}, {
    timestamps: true
});

const Candidate_Module = mongoose.model("Candidate", userSchema);

module.exports = Candidate_Module;
