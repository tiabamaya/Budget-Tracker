const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    default: "Salary",
  },
});

module.exports = mongoose.model("Income", IncomeSchema);
