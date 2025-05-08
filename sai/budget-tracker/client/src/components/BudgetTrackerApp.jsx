// BudgetTrackerApp.jsx
import React, { useState } from "react";
import "../styles/BudgetTrackerApp.css";
import IncomeSection from "./components/IncomeSection";
import BillsSection from "./components/BillsSection";
import ExpensesSection from "./components/ExpensesSection";
import SavingsSection from "./components/SavingsSection";
import DebtSection from "./components/DebtSection";
import SummaryCharts from "./components/SummaryCharts";

const BudgetTrackerApp = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [billsData, setBillsData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [debtData, setDebtData] = useState([]);


  return (
    <div className="budget-app">
      <h1 className="app-title">Monthly Budget</h1>
      <p className="month-label">Month: January</p>

      <div className="budget-sections">
        <IncomeSection data={incomeData} setData={setIncomeData} />
        <BillsSection data={billsData} setData={setBillsData} />
        <ExpensesSection data={expensesData} setData={setExpensesData} />
        <SavingsSection data={savingsData} setData={setSavingsData} />
        <DebtSection data={debtData} setData={setDebtData} />
      </div>

      <SummaryCharts
        income={incomeData}
        bills={billsData}
        expenses={expensesData}
        savings={savingsData}
        debt={debtData}
      />


    </div>
  );
};

export default BudgetTrackerApp;
