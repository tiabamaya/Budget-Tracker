const express = require("express");
const router = express.Router();
const Bill = require("../models/bill");

// GET all bills for selected month
router.get("/", async (req, res) => {
    const { month } = req.query;

    try {
        const bills = await Bill.find({ month }).sort({ date: -1 });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// POST a new bill
router.post("/", async (req, res) => {
    const { bill, date, expected, actual, month } = req.body;

    if (!bill || !date || !expected || !actual || !month) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newBill = new Bill({ bill, date, expected, actual, month });
        const savedBill = await newBill.save();
        res.json(savedBill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update a bill
router.put("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const updatedBill = await Bill.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBill) return res.status(404).json({ message: "Bill not found" });
        res.json(updatedBill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a bill
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBill = await Bill.findByIdAndDelete(id);
        if (!deletedBill) return res.status(404).json({ message: "Bill not found" });
        res.json({ message: "Bill deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
