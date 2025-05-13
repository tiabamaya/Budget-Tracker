const mongoose = require("mongoose");

const SavingSchema = new mongoose.Schema({
    goal: String,
    amount: Number,
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Saving", SavingSchema);
