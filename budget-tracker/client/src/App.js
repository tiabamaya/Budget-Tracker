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
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [selectedMonth, setSelectedMonth] = useState("January");

  const [monthlyBudgets, setMonthlyBudgets] = useState(() =>
    months.reduce((acc, month) => {
      acc[month] = { income: [], expenses: [], savings: [], debt: [], transactions: [] };
      return acc;
    }, {})
  );

  // Individual state for current month data
  const [incomeData, setIncomeData] = useState([]);
  const [billsData, setBillsData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [debtData, setDebtData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Load data when a month is selected
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    
    const monthData = monthlyBudgets[month];

    setIncomeData(monthData.income || []);
    setExpensesData(monthData.expenses || []);
    setSavingsData(monthData.savings || []);
    setDebtData(monthData.debt || []);
    setTransactions(monthData.transactions || []);
  };

  const updateMonthlyData = (section, data) => {
    const updatedMonth = {
      ...monthlyBudgets[selectedMonth],
      [section]: data
    };

    setMonthlyBudgets((prev) => ({
      ...prev,
      [selectedMonth]: updatedMonth
    }));

    // Update local states
    if (section === "income") setIncomeData(data);
    if (section === "expenses") setExpensesData(data);
    if (section === "savings") setSavingsData(data);
    if (section === "debt") setDebtData(data);
    if (section === "transactions") setTransactions(data);
  };

  const handleTransactionUpdate = (updatedTransactions) => {
    setTransactions(updatedTransactions);

    // Update actuals in expenses
    const updatedExpenses = expensesData.map((row) => {
      const total = updatedTransactions
        .filter((tx) => tx.category === row.category)
        .reduce((sum, tx) => sum + (parseFloat(tx.amount?.replace(/,/g, "")) || 0), 0);

      return { ...row, actual: total.toString() };
    });

    setExpensesData(updatedExpenses);

    setMonthlyBudgets((prev) => ({
      ...prev,
      [selectedMonth]: {
        ...prev[selectedMonth],
        transactions: updatedTransactions,
        expenses: updatedExpenses
      }
    }));
  };

  return (
    <div className="main-container">
      <h1 style={{ textAlign: "center" }}>Monthly Budget</h1>

      {/* Month Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
        {months.map((month) => (
          <button
            key={month}
            onClick={() => handleMonthChange(month)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: selectedMonth === month ? '#007bff' : '#f8f9fa',
              color: selectedMonth === month ? '#fff' : '#000',
              cursor: 'pointer'
            }}
          >
            {month}
          </button>
        ))}
      </div>

      <div className="layout-container">
        {/* Left Side */}
        <div className="left-side">
          <div className="section">
            <IncomeTable
              onIncomeUpdate={(data) => updateMonthlyData("income", data)}
              selectedMonth={selectedMonth}  // Pass selectedMonth as prop
            />
            <BillsTable onBillsUpdate={setBillsData} />
            <DebtTable onDebtUpdate={(data) => updateMonthlyData("debt", data)} />
            <SavingsTable onSavingsUpdate={(data) => updateMonthlyData("savings", data)} />
          </div>
        </div>

        {/* Right Side */}
        <div className="right-side">
          <div className="summary-section">
            <Summary
              incomeData={incomeData}
              billData={billsData}
              expenseData={expensesData}
              savingData={savingsData}
              debtData={debtData}
            />
          </div>

          <ExpensesTable onExpensesUpdate={(data) => updateMonthlyData("expenses", data)} />

          <div className="section">
            <TransactionTable
              expensesData={expensesData}
              onTransactionAdd={handleTransactionUpdate}
              categories={expensesData.map(e => e.category)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
