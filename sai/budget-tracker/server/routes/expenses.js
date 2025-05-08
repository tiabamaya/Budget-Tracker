const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// GET all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new expense
router.post("/", async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const expense = new Expense({
      amount,
      description,
      category,
      date: new Date(),
    });
    const saved = await expense.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "Could not save expense" });
  }
});

module.exports = router;
