const mongoose = require("mongoose");

const SavingSchema = new mongoose.Schema({
    category: { type: String, required: true },
    expected: { type: Number, required: true },
    actual: { type: Number, required: true },
    month: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Saving", SavingSchema);

