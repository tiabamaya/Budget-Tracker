const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  expected: { type: Number, required: true },
  month: { type: String, required: true }
});

module.exports = mongoose.model("Expense", ExpenseSchema);
