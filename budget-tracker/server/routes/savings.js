const express = require("express");
const router = express.Router();
const Saving = require("../models/Saving")

// GET all savings for a specific month
router.get("/", async (req, res) => {
    const { month } = req.query;
    try {
        const savings = await Saving.find(month ? { month } : {}).sort({ dateCreated: -1 });
        res.json(savings);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// POST create new saving
router.post("/", async (req, res) => {
    const { category, expected, actual, month } = req.body;

    try {
        const saving = new Saving({ category, expected, actual, month });
        const saved = await saving.save();
        res.json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update saving by id
router.put("/:id", async (req, res) => {
    try {
        const updated = await Saving.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Saving not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE saving by id
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Saving.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Saving not found" });
        res.json({ message: "Saving deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
