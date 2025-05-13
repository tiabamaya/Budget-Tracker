const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    dueDate: Date,
    paid: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("Bill", BillSchema);
