// models/Officer.js
const mongoose = require("mongoose");

const officerSchema = new mongoose.Schema({
  name: String,
  badgeId: String,
  location: String
});

module.exports = mongoose.model("Officer", officerSchema);