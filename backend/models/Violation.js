// models/Violation.js
const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema({
  vehicleNo: String,   // 🔥 add this (only important change)
  location: String,
  type: String,
  severity: String,
  time: { type: Date, default: Date.now },
  status: String,      // Pending, Paid, Contested, Completed
  fine: Number
});

module.exports = mongoose.model("Violation", violationSchema);