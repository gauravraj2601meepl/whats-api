const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    distance: String,
    user: String,
    location_type: String,
    address: String,
    name: String

}, {
    timestamps: false
});

const Location_Module = mongoose.model("Location", locationSchema);

module.exports = Location_Module;
