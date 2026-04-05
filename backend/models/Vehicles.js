// models/Vehicle.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  vehicleNo: { type: String, required: true, unique: true },
  ownerName: String,
  vehicleType: String,
  model: String
});

module.exports = mongoose.model("Vehicle", vehicleSchema);