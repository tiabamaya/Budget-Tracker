import React from "react";
import "../styles/Budget.css";

const HistoryView = ({ monthlyBudgets }) => {
  return (
    <div className="history-section">
      <h3>Budget History</h3>
      {Object.entries(monthlyBudgets).map(([month, data]) => (
        <div key={month} className="history-month">
          <h4>{month}</h4>
          <p><strong>Income:</strong> {data.income.length} items</p>
          <p><strong>Expenses:</strong> {data.expenses.length} items</p>
          <p><strong>Savings:</strong> {data.savings.length} items</p>
          <p><strong>Debt:</strong> {data.debt.length} items</p>
        </div>
      ))}
    </div>
  );
};

export default HistoryView;
