import React, { useState } from "react";
import "../styles/Budget.css";

const IncomeTable = ({ selectedMonth }) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [incomeRows, setIncomeRows] = useState([
    { source: "", date: "", expected: "", actual: "" },
  ]);

  const selectedMonthIndex = months.indexOf(selectedMonth);
  const currentYear = new Date().getFullYear();
  const minDate = `${currentYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}-01`;
  const maxDate = new Date(currentYear, selectedMonthIndex + 1, 0).toISOString().split("T")[0];

  const handleChange = (index, field, value) => {
    const updatedRows = [...incomeRows];
    updatedRows[index][field] = value;
    setIncomeRows(updatedRows);
  };

  const addRow = () => {
    setIncomeRows([...incomeRows, { source: "", date: "", expected: "", actual: "" }]);
  };

  const deleteRow = (index) => {
    const updatedRows = incomeRows.filter((_, i) => i !== index);
    setIncomeRows(updatedRows);
  };

  // Total only for rows that match selected month
  const total = (type) =>
    incomeRows.reduce((sum, row) => {
      if (!row.date) return sum;
      const dateObj = new Date(row.date);
      const monthMatches = dateObj.getMonth() === selectedMonthIndex && dateObj.getFullYear() === currentYear;
      return monthMatches ? sum + parseFloat(row[type] || 0) : sum;
    }, 0);

  return (
    <div className="container">
      <h2>Income - {selectedMonth}</h2>
      <table className="budget-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Date</th>
            <th>Expected</th>
            <th>Actual</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {incomeRows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  value={row.source}
                  onChange={(e) => handleChange(index, "source", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  min={minDate}
                  max={maxDate}
                  value={row.date}
                  onChange={(e) => handleChange(index, "date", e.target.value)}
                  onKeyDown={(e) => e.preventDefault()} // Prevent typing
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.expected}
                  onChange={(e) => handleChange(index, "expected", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.actual}
                  onChange={(e) => handleChange(index, "actual", e.target.value)}
                />
              </td>
              <td>
                {index > 0 && (
                  <button onClick={() => deleteRow(index)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="2">Total</td>
            <td>₱{total("expected").toLocaleString()}</td>
            <td>₱{total("actual").toLocaleString()}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <button onClick={addRow}>Add Income</button>
    </div>
  );
};

export default IncomeTable;
