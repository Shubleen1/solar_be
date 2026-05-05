const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  project: String,
  amount: Number,
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending"
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);