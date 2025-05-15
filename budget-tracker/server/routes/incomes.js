const express = require("express");
const router = express.Router();
const Income = require("../models/Income");

// ✅ GET all incomes (optional query by month)
router.get("/", async (req, res) => {
  try {
    const { month } = req.query;
    let query = {};

    if (month) {
      query.month = month;
    }

    const incomes = await Income.find(query).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST create a new income
router.post("/", async (req, res) => {
  try {
    const income = new Income(req.body);
    const savedIncome = await income.save();
    res.status(201).json(savedIncome);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ✅ PUT update income by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json(updatedIncome);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE income by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedIncome = await Income.findByIdAndDelete(req.params.id);

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json({ message: "Income deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
