import React, { useState } from "react";
import "../styles/Budget.css";

const SavingsTable = ({ onSavingsUpdate }) => {
    const [savingsRows, setSavingsRows] = useState([
        { category: "Travel Fund", expected: "", actual: "" },
        { category: "Car Fund", expected: "", actual: "" },
        { category: "Christmas Shopping", expected: "", actual: "" },
        { category: "Emergency", expected: "", actual: "" },
    ]);

    const handleChange = (index, field, value) => {
        const updated = [...savingsRows];
        updated[index][field] = value;
        setSavingsRows(updated);
        onSavingsUpdate(updated);
    };

    const formatNumberWithCommas = (value) => {
        const num = parseFloat(value.replace(/,/g, ""));
        return isNaN(num) ? "" : num.toLocaleString();
    };

    const handleInputChange = (e, rowIndex, key) => {
        const input = e.target.value.replace(/,/g, "");
        if (!isNaN(input)) {
            const updated = savingsRows.map((row, i) =>
                i === rowIndex ? { ...row, [key]: input } : row
            );
            setSavingsRows(updated);
            onSavingsUpdate(updated);
        }
    };

    const addRow = () => {
        const newRows = [...savingsRows, { category: "", expected: "", actual: "" }];
        setSavingsRows(newRows);
        onSavingsUpdate(newRows);
    };

    const deleteRow = (index) => {
        const updatedRows = savingsRows.filter((_, i) => i !== index);
        setSavingsRows(updatedRows);
        onSavingsUpdate(updatedRows);
    };

    const total = (type) =>
        savingsRows.reduce((sum, row) => sum + parseFloat(row[type] || 0), 0);

    return (
        <div className="container">
            <div className="section">
                <h2>Savings</h2>
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Expected</th>
                            <th>Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {savingsRows.map((row, index) => (
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
                                        inputMode="numeric"
                                        className="budget-input"
                                        value={formatNumberWithCommas(row.actual || "")}
                                        onChange={(e) => handleInputChange(e, index, "actual")}
                                    />
                                </td>
                                    {index > 0 && (
                                        <button
                                         className="add-row-btn"
                                            onClick={() => deleteRow(index)}
                                            style={{ backgroundColor: "#e57373", marginLeft: "10px" }} // Adds gap to the left of the button
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
                <button onClick={addRow} className="add-row-btn">Add Saving Goal</button>
            </div>
        </div>
    );
};

export default SavingsTable;
