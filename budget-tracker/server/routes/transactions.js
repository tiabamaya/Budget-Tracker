const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");

// Get all transactions for a month
router.get("/", async (req, res) => {
    const { month } = req.query;
    try {
        const transactions = await Transaction.find({ month });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Add new transaction
router.post("/", async (req, res) => {
    const { date, amount, description, category, month } = req.body;

    if (!date || !amount || !description || !category || !month) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newTransaction = new Transaction({ date, amount, description, category, month });
        const saved = await newTransaction.save();
        res.json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update transaction
router.put("/:id", async (req, res) => {
    try {
        const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Transaction not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete transaction
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Transaction.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Transaction not found" });
        res.json({ message: "Transaction deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
