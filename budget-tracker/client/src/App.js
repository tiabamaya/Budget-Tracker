import React, { useState } from "react";
import IncomeTable from "./components/IncomeTable";
import BillsTable from "./components/BillsTable";
import ExpensesTable from "./components/ExpensesTable";
import SavingsTable from "./components/SavingsTable";
import TransactionTable from "./components/TransactionTable";
import DebtTable from "./components/DebtTable";
import Summary from "./components/Summary";
import HistoryView from "./components/HistoryViews";
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

    const newExpensesData = expensesData.map(row => {
      const totalForCategory = updatedTransactions
        .filter(tx => tx.category === row.category)
        .reduce((sum, tx) => sum + (parseFloat(tx.amount?.replace(/,/g, "")) || 0), 0);

      return { ...row, actual: totalForCategory.toString() };
    });

    setExpensesData(newExpensesData);
  };

  const [selectedMonth, setSelectedMonth] = useState("January");
  const [monthlyBudgets, setMonthlyBudgets] = useState({
    January: { income: [], expenses: [], savings: [], debt: [] },
    February: { income: [], expenses: [], savings: [], debt: [] },
    March: { income: [], expenses: [], savings: [], debt: [] },
    April: { income: [], expenses: [], savings: [], debt: [] },
    May: { income: [], expenses: [], savings: [], debt: [] },
    June: { income: [], expenses: [], savings: [], debt: [] },
    July: { income: [], expenses: [], savings: [], debt: [] },
    August: { income: [], expenses: [], savings: [], debt: [] },
    September: { income: [], expenses: [], savings: [], debt: [] },
    October: { income: [], expenses: [], savings: [], debt: [] },
    November: { income: [], expenses: [], savings: [], debt: [] },
    December: { income: [], expenses: [], savings: [], debt: [] },
  });
  const [showHistory, setShowHistory] = useState(false);

  const updateMonthlyData = (section, data) => {
    const updatedMonthData = {
      ...monthlyBudgets[selectedMonth],
      [section]: data
    };
    setMonthlyBudgets({ ...monthlyBudgets, [selectedMonth]: updatedMonthData });
  
    // Update local state too
    if (section === "income") setIncomeData(data);
    if (section === "expenses") setExpensesData(data);
    if (section === "savings") setSavingsData(data);
    if (section === "debt") setDebtData(data);
  };

  return (
    <div className="main-container">
      <h1 style={{ textAlign: "center" }}>Monthly Budget</h1>
      <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
  {Object.keys(monthlyBudgets).map((month) => (
    <option key={month} value={month}>{month}</option>
  ))}
</select>
<button onClick={() => setShowHistory(!showHistory)}>
  {showHistory ? "Hide History" : "View Budget History"}
</button>

{showHistory && <HistoryView monthlyBudgets={monthlyBudgets} />}
      <div className="layout-container">
        {/* Left Side */}
        <div className="left-side">
          <div className="section">
          <IncomeTable onIncomeUpdate={(data) => updateMonthlyData("income", data)} />
          <BillsTable onBillsUpdate={setBillsData} /> 
          <DebtTable onDebtUpdate={(data) => updateMonthlyData("debt", data)} />
          <SavingsTable onSavingsUpdate={(data) => updateMonthlyData("savings", data)} />
          </div>
        </div>

        {/* Right Side */}
        <div className="right-side">
          {/* Summary stays at the top */}
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

          {/* Expenses and Transactions go below the summary */}
          <div className="section">
          <TransactionTable
            expensesData={expensesData}
            onTransactionAdd={(txs) => {
              setTransactions(txs);
              const updated = expensesData.map(row => {
                const total = txs.filter(tx => tx.category === row.category)
                  .reduce((sum, tx) => sum + (parseFloat(tx.amount?.replace(/,/g, "")) || 0), 0);
                return { ...row, actual: total.toString() };
              });
              updateMonthlyData("expenses", updated);
            }}
            categories={expensesData.map(e => e.category)}
          />
                 


          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
