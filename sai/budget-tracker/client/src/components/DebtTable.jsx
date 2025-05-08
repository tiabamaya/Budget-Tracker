import React, { useState } from "react";
import "../styles/Budget.css";

const DebtTable = ({ onDebtUpdate }) => {
    const [debtRows, setDebtRows] = useState([
        { category: "Home Loan", expected: "", actual: "" },
        { category: "Car Loan", expected: "", actual: "" },
        { category: "Student Loan", expected: "", actual: "" },
    ]);

    const handleChange = (index, field, value) => {
        const updated = [...debtRows];
        updated[index][field] = value;
        setDebtRows(updated);
        onDebtUpdate(updated);
    };

    const formatNumberWithCommas = (value) => {
        const num = parseFloat(value.replace(/,/g, ""));
        return isNaN(num) ? "" : num.toLocaleString();
    };

    const handleInputChange = (e, rowIndex, key, data, setData) => {
        const input = e.target.value.replace(/,/g, "");
        if (!isNaN(input)) {
            const updated = debtRows.map((row, i) =>
                i === rowIndex ? { ...row, [key]: input } : row
            );
            setDebtRows(updated);
            onDebtUpdate(updated);
        }
    };

    const addRow = () => {
        const newRows = [...debtRows, { source: "", expected: "", actual: "" }];
        setDebtRows(newRows);
        onDebtUpdate(newRows);
    };

    const total = (type) =>
        debtRows.reduce((sum, row) => sum + parseFloat(row[type] || 0), 0);

    return (
        <div className="container">
            <div className="section">
                <h2>Debt</h2>
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Expected</th>
                            <th>Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {debtRows.map((row, index) => (
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
                                        onChange={(e) => handleInputChange(e, index, "expected", debtRows, setDebtRows)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className="budget-input"
                                        value={formatNumberWithCommas(row.actual || "")}
                                        onChange={(e) => handleInputChange(e, index, "actual", debtRows, setDebtRows)}
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr className="totals">
                            <td>Total</td>
                            <td>₱{total("expected").toLocaleString()}</td>
                            <td>₱{total("actual").toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={addRow} className="add-row-btn">Add Debt</button>
            </div>
        </div>
    );
};

export default DebtTable;
