const mongoose = require("mongoose");

const DebtSchema = new mongoose.Schema({
    creditor: String,
    amount: Number,
    dueDate: Date,
    paid: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("Debt", DebtSchema);
