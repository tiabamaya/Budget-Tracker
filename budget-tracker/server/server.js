const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CORS preflight fix
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ✅ Routes
app.use("/api/incomes", require("./routes/incomes"));
app.use("/api/debts", require("./routes/debts"));
app.use("/api/bills", require("./routes/bills"));
app.use("/api/savings", require("./routes/savings"));
app.use("/api/variable-expenses", require("./routes/expenses"));
app.use("/api/transactions", require("./routes/transactions"));
app.use('/api/expenses', require('./routes/expenses'));


const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
