import React, { useState } from "react";
import IncomeTable from "./components/IncomeTable";
import BillsTable from "./components/BillsTable";
import ExpensesTable from "./components/ExpensesTable";
import SavingsTable from "./components/SavingsTable";
import TransactionTable from "./components/TransactionTable";
import DebtTable from "./components/DebtTable";
import Summary from "./components/Summary";
import "./styles/Budget.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [billsData, setBillsData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [debtData, setDebtData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const handleTransactionUpdate = (updatedTransactions) => {
    setTransactions(updatedTransactions);

    // Recalculate actuals from scratch
    const newExpensesData = expensesData.map(row => {
      const totalForCategory = updatedTransactions
        .filter(tx => tx.category === row.category)
        .reduce((sum, tx) => sum + (parseFloat(tx.amount?.replace(/,/g, "")) || 0), 0);

      return { ...row, actual: totalForCategory.toString() };
    });

    setExpensesData(newExpensesData);
  };


  return (
    <div>
      <div className="main-container">
        <h1 style={{ textAlign: "center" }}>Monthly Budget</h1>


        <div className="d-flex justify-content-center align-items-center">
          <IncomeTable onIncomeUpdate={setIncomeData} />
          <BillsTable onBillsUpdate={setBillsData} />
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <ExpensesTable onExpensesUpdate={setExpensesData} />
          <SavingsTable onSavingsUpdate={setSavingsData} />
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <TransactionTable
            expensesData={expensesData}
            onTransactionAdd={handleTransactionUpdate}
            categories={expensesData.map(e => e.category)}
          />
          <DebtTable onDebtUpdate={setDebtData} />
        </div>

      </div>
      <Summary
        incomeData={incomeData}
        billData={billsData}
        expenseData={expensesData}
        savingData={savingsData}
        debtData={debtData}
      />


    </div>


  );
};

export default App;
