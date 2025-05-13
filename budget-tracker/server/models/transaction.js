const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    amount: Number,
    description: String,
    category: String, // Should match categories in your UI
});

module.exports = mongoose.model("Transaction", TransactionSchema);
