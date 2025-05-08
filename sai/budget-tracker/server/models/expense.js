const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    default: "General",
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
