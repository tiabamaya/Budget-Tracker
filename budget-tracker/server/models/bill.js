const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
    bill: { type: String, required: true },
    date: { type: Date, required: true },
    expected: { type: Number, required: true },
    actual: { type: Number, required: true },
    month: { type: String, required: true },
});

module.exports = mongoose.model("Bill", BillSchema);
