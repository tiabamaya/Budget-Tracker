const express = require("express");
const router = express.Router();
const Expense = require("../models/expense");

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get expenses by month (optional filter)
router.get("/:month", async (req, res) => {
  try {
    const expenses = await Expense.find({ month: req.params.month });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create expense
router.post("/", async (req, res) => {
  const { category, expected, month } = req.body;

  if (!category || !expected || !month) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newExpense = new Expense({ category, expected, month });

  try {
    const saved = await newExpense.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update expense
router.put("/:id", async (req, res) => {
  const { category, expected } = req.body;

  if (!category || !expected) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { category, expected },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete expense
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
