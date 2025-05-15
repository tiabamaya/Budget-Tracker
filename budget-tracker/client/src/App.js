import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import IncomeTable from "./components/IncomeTable";
import BillsTable from "./components/BillsTable";
import VariableExpensesTable from "./components/ExpensesTable";
import SavingsTable from "./components/SavingsTable";
import TransactionTable from "./components/TransactionTable";
import DebtTable from "./components/DebtTable";
import Summary from "./components/Summary";
import AuthPage from './components/AuthPage';
import "./styles/Budget.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [incomeData, setIncomeData] = useState([]);
  const [billsData, setBillsData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [debtData, setDebtData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [selectedMonth, setSelectedMonth] = useState("January");

  // Load user once
  useEffect(() => {
    const savedUser = localStorage.getItem("authUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);


  useEffect(() => {
    if (!user) return;

    axios.get(`http://localhost:5000/api/expenses?month=${selectedMonth}`)
      .then(res => setExpensesData(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:5000/api/transactions?month=${selectedMonth}`)
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, [selectedMonth, user]);



  // Generic updateMonthlyData function (normal function, not a hook)
  const updateMonthlyData = (section, data) => {
    if (section === "income") setIncomeData(data);
    if (section === "expenses") setExpensesData(data);
    if (section === "savings") setSavingsData(data);
    if (section === "debt") setDebtData(data);
    if (section === "bills") setBillsData(data);
    if (section === "transactions") setTransactions(data);
  };

  // useCallback to prevent re-render loops (correct usage at top level)
  const handleIncomeUpdate = useCallback((data) => updateMonthlyData("income", data), []);
  const handleBillsUpdate = useCallback((data) => updateMonthlyData("bills", data), []);
  const handleExpensesUpdate = useCallback((data) => updateMonthlyData("expenses", data), []);
  const handleSavingsUpdate = useCallback((data) => updateMonthlyData("savings", data), []);
  const handleDebtUpdate = useCallback((data) => updateMonthlyData("debt", data), []);

  const handleTransactionUpdate = (updatedTransactions) => {
    setTransactions(updatedTransactions);

    const updatedExpenses = expensesData.map((row) => {
      if (!row) return row;
      const total = updatedTransactions
        .filter((tx) => tx.category === row.category)
        .reduce((sum, tx) => {
          const amt = typeof tx.amount === "string" ? tx.amount.replace(/,/g, "") : tx.amount || 0;
          return sum + parseFloat(amt);
        }, 0);
      return { ...row, actual: total.toString() };
    });

    setExpensesData(updatedExpenses);
  };

  <button onClick={() => { localStorage.removeItem("authUser"); window.location.reload(); }}>
    Logout
  </button>

  if (!user) {
    return <AuthPage setUser={setUser} />;
  }
  return (
    <div className="main-container">
      <div style={{ textAlign: "right", margin: "1rem" }}>
        <button
          onClick={() => {
            localStorage.removeItem("authUser");
            setUser(null);
          }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <h1 style={{ textAlign: "center" }}>Monthly Budget</h1>

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {months.map((month) => (
          <button
            key={month}
            type="button"
            onClick={() => setSelectedMonth(month)}
            className="month-btn"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#d277b1',
              color: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: '1',
              textAlign: 'center',
            }}
          >
            {month}
          </button>
        ))}
      </div>

      <div className="layout-container">
        <div className="left-side">
          <div className="section">
            <IncomeTable
              selectedMonth={selectedMonth}
              onIncomeUpdate={handleIncomeUpdate}
            />

            <BillsTable
              selectedMonth={selectedMonth}
              onBillsUpdate={handleBillsUpdate}
            />

            <DebtTable
              selectedMonth={selectedMonth}
              onDebtUpdate={handleDebtUpdate}
            />

            <SavingsTable
              selectedMonth={selectedMonth}
              onSavingsUpdate={handleSavingsUpdate}
            />

            <VariableExpensesTable
              selectedMonth={selectedMonth}
              variableExpenses={expensesData}
              transactions={transactions}
              onUpdate={(data) => updateMonthlyData("expenses", data)}
            />

          </div>
        </div>

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

          <div className="section">
            <TransactionTable
              selectedMonth={selectedMonth}
              transactions={transactions}
              onTransactionUpdate={handleTransactionUpdate}
              categories={expensesData.filter(e => e).map(e => e.category || "")}
            />


          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
