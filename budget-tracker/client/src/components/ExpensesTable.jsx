import React, { useState } from "react";
import "../styles/Budget.css";

const ExpensesTable = ({ onExpensesUpdate }) => {
    const [expenseRows, setExpenseRows] = useState([
        { category: "Groceries", expected: "", actual: "" },
    ]);

    const handleChange = (index, field, value) => {
        const updated = [...expenseRows];
        updated[index][field] = value;
        setExpenseRows(updated);
        onExpensesUpdate(updated);
    };

    const deleteRow = (index) => {
      const updatedRows = expenseRows.filter((_, i) => i !== index);
      setExpenseRows(updatedRows);
      onExpensesUpdate(updatedRows);
  };

    const formatNumberWithCommas = (value) => {
        const num = parseFloat(value.replace(/,/g, ""));
        return isNaN(num) ? "" : num.toLocaleString();
    };

    const handleInputChange = (e, rowIndex, key) => {
        const input = e.target.value.replace(/,/g, "");
        if (!isNaN(input)) {
            const updated = expenseRows.map((row, i) =>
                i === rowIndex ? { ...row, [key]: input } : row
            );
            setExpenseRows(updated);
            onExpensesUpdate(updated);
        }
    };

    const addRow = () => {
        const newRows = [...expenseRows, { category: "", expected: "", actual: "" }];
        setExpenseRows(newRows);
        onExpensesUpdate(newRows);
    };

    const total = (type) =>
        expenseRows.reduce((sum, row) => sum + parseFloat(row[type] || 0), 0);

    return (
        <div className="container">
            <div className="section">
                <h2>Variable Expenses</h2>
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Expected</th>
                            <th>Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenseRows.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        value={row.category}
                                        onChange={(e) => handleChange(index, "category", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className="budget-input"
                                        value={formatNumberWithCommas(row.expected || "")}
                                        onChange={(e) => handleInputChange(e, index, "expected")}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="budget-input"
                                        value={formatNumberWithCommas(row.actual || "")}
                                        disabled // ✅ Make actual field read-only
                                    />
                                </td>
                                {index > 0 && (
                  <button
                    className="add-row-btn"
                    onClick={() => deleteRow(index)}
                    style={{ backgroundColor: "#e57373", marginLeft: "4px" }}
                  >
                    Delete
                  </button>
                )}
                            </tr>
                        ))}
                        <tr className="totals">
                            <td>Total</td>
                            <td>₱{total("expected").toLocaleString()}</td>
                            <td>₱{total("actual").toLocaleString()}</td>
                        </tr>
                    </tbody>
                    
                </table>
                <button onClick={addRow} className="add-row-btn">Add Category</button>
            </div>
        </div>
    );
};

export default ExpensesTable;
