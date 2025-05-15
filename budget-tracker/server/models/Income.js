const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema({
  source: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  expected: { type: Number, default: 0 },
  actual: { type: Number, default: 0 },
  month: { type: String, required: true }
});


module.exports = mongoose.model("Income", IncomeSchema);
