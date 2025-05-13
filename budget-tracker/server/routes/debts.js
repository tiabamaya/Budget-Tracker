const express = require("express");
const router = express.Router();
const Debt = require("../models/debt");

router.get("/", async (req, res) => {
    try {
        const debts = await Debt.find().sort({ dueDate: 1 });
        res.json(debts);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/", async (req, res) => {
    const { creditor, amount, dueDate, paid } = req.body;

    try {
        const debt = new Debt({ creditor, amount, dueDate, paid });
        const saved = await debt.save();
        res.json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
