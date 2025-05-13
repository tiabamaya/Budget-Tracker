const express = require("express");
const router = express.Router();
const Bill = require("../models/bill");

router.get("/", async (req, res) => {
    try {
        const bills = await Bill.find().sort({ dueDate: 1 });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/", async (req, res) => {
    const { name, amount, dueDate, paid } = req.body;

    try {
        const bill = new Bill({ name, amount, dueDate, paid });
        const saved = await bill.save();
        res.json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
