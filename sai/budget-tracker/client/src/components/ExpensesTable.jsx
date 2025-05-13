import React, { useState } from "react";

const ExpensesTable = ({ onExpensesUpdate }) => {
  const [rows, setRows] = useState([
    { category: "", planned: "", actual: "" }
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
    onExpensesUpdate(updatedRows);
  };

  const handleAddRow = () => {
    const newRows = [...rows, { category: "", planned: "", actual: "" }];
    setRows(newRows);
    onExpensesUpdate(newRows);
  };

  const handleDeleteRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    onExpensesUpdate(newRows);
  };

  return (
    <div>
      <h3>Expenses</h3>
      <table className="budget-table" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Category</th>
            <th style={{ width: "20%" }}>Planned</th>
            <th style={{ width: "20%" }}>Actual</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.category}
                  onChange={(e) => handleInputChange(index, "category", e.target.value)}
                  placeholder="e.g. Groceries"
                  className="budget-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.planned}
                  onChange={(e) => handleInputChange(index, "planned", e.target.value)}
                  className="budget-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.actual}
                  onChange={(e) => handleInputChange(index, "actual", e.target.value)}
                  className="budget-input"
                />
              </td>
                {index > 0 && (
                  <button
                    className="add-row-btn"
                    onClick={() => handleDeleteRow(index)}
                    style={{ backgroundColor: "#e57373", marginLeft: "4px" }}
                  >
                    Delete
                  </button>
                )}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-row-btn" onClick={handleAddRow}>
        + Add Row
      </button>
    </div>
  );
};

export default ExpensesTable;
