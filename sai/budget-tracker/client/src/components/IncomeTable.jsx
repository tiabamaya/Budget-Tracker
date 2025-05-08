import React, { useState } from "react";
import "../styles/Budget.css";

const IncomeTable = ({ onIncomeUpdate }) => {
    const [incomeRows, setIncomeRows] = useState([
        { source: "", date: "", expected: "", actual: "" },
    ]);

    const handleChange = (index, field, value) => {
        const updatedRows = [...incomeRows];
        updatedRows[index][field] = value;
        setIncomeRows(updatedRows);
        onIncomeUpdate(updatedRows); // keep this
    };

    const formatNumberWithCommas = (value) => {
        const num = parseFloat(value.replace(/,/g, ""));
        return isNaN(num) ? "" : num.toLocaleString();
    };

    const handleInputChange = (e, rowIndex, key) => {
        const input = e.target.value.replace(/,/g, "");
        if (!isNaN(input)) {
            const updated = incomeRows.map((row, i) =>
                i === rowIndex ? { ...row, [key]: input } : row
            );
            setIncomeRows(updated);
            onIncomeUpdate(updated); // ✅ added this to propagate changes
        }
    };

    const addRow = () => {
        const newRows = [...incomeRows, { source: "", date: "", expected: "", actual: "" }];
        setIncomeRows(newRows);
        onIncomeUpdate(newRows); // ✅ ensure parent gets new row
    };

    const total = (type) =>
        incomeRows.reduce((sum, row) => sum + parseFloat(row[type] || 0), 0);

    return (
        <div className="container">
            <div className="section">
                <h2>Income</h2>
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Date</th>
                            <th>Expected</th>
                            <th>Actual</th>
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
                                        value={row.date}
                                        onChange={(e) => handleChange(index, "date", e.target.value)}
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
                            </tr>
                        ))}
                        <tr className="totals">
                            <td colSpan="2">Total</td>
                            <td>₱{total("expected").toLocaleString()}</td>
                            <td>₱{total("actual").toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={addRow} className="add-row-btn">Add Income</button>
            </div>
        </div>
    );
};

export default IncomeTable;
