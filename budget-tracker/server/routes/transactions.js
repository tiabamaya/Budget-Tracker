const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");

router.get("/", async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/", async (req, res) => {
    const { date, amount, description, category } = req.body;

    try {
        const transaction = new Transaction({ date, amount, description, category });
        const saved = await transaction.save();
        res.json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
