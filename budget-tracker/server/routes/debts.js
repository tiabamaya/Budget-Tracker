const express = require("express");
const router = express.Router();
const Debt = require("../models/debt");

// GET all debts for selected month
router.get("/", async (req, res) => {
    const { month } = req.query;

    try {
        const debts = await Debt.find({ month }).sort({ date: -1 });
        res.json(debts);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// POST a new debt
router.post("/", async (req, res) => {
    const { debt, date, expected, actual, month } = req.body;

    if (!debt || !date || !expected || !actual || !month) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newDebt = new Debt({ debt, date, expected, actual, month });
        const savedDebt = await newDebt.save();
        res.json(savedDebt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update a debt
router.put("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const updatedDebt = await Debt.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDebt) return res.status(404).json({ message: "Debt not found" });
        res.json(updatedDebt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a debt
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDebt = await Debt.findByIdAndDelete(id);
        if (!deletedDebt) return res.status(404).json({ message: "Debt not found" });
        res.json({ message: "Debt deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
