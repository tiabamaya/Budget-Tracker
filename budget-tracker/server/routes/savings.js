const express = require("express");
const router = express.Router();
const Saving = require("../models/saving");

router.get("/", async (req, res) => {
    try {
        const savings = await Saving.find().sort({ date: -1 });
        res.json(savings);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/", async (req, res) => {
    const { goal, amount } = req.body;

    try {
        const saving = new Saving({ goal, amount });
        const saved = await saving.save();
        res.json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
