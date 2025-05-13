const express = require("express");
const router = express.Router();
const Income = require("../models/Income");

// GET all incomes
router.get("/", async (req, res) => {
  try {
    const incomes = await Income.find().sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// POST a new income
router.post("/", async (req, res) => {
  const { amount, source } = req.body;

  try {
    const income = new Income({ amount, source });
    const saved = await income.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
