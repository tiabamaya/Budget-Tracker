const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/incomes", require("./routes/Incomes"));
app.use("/api/bills", require("./routes/bills"));
app.use("/api/debts", require("./routes/debts"));
app.use("/api/savings", require("./routes/savings"));
app.use("/api/transactions", require("./routes/transactions"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
