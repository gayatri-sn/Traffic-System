// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  violationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Violation"
  },
  amount: Number,
  paymentMethod: String,
  paymentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);