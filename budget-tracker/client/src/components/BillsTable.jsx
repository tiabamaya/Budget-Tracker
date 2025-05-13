import React, { useState } from "react";
import "../styles/Budget.css";

const BillsTable = ({ onBillsUpdate }) => {
    const [billRows, setBillRows] = useState([
        { bill: "", dueDate: "", expected: "", actual: "" },
    ]);

    const handleChange = (index, field, value) => {
        const updated = [...billRows];
        updated[index][field] = value;
        setBillRows(updated);
        onBillsUpdate(updated);
    };

    const formatNumberWithCommas = (value) => {
        const num = parseFloat(value.replace(/,/g, ""));
        return isNaN(num) ? "" : num.toLocaleString();
    };

    const handleInputChange = (e, rowIndex, key) => {
        const input = e.target.value.replace(/,/g, "");
        if (!isNaN(input)) {
            const updated = billRows.map((row, i) =>
                i === rowIndex ? { ...row, [key]: input } : row
            );
            setBillRows(updated);
            onBillsUpdate(updated);
        }
    };

    const addRow = () => {
        const newRows = [...billRows, { bill: "", dueDate: "", expected: "", actual: "" }];
        setBillRows(newRows);
        onBillsUpdate(newRows);
    };

    const deleteRow = (index) => {
        const updatedRows = billRows.filter((_, i) => i !== index);
        setBillRows(updatedRows);
        onBillsUpdate(updatedRows);
    };

    const total = (type) =>
        billRows.reduce((sum, row) => sum + parseFloat(row[type] || 0), 0);

    return (
        <div className="container">
            <div className="section">
                <h2>Bills</h2>
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>Bill</th>
                            <th>Due Date</th>
                            <th>Expected</th>
                            <th>Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billRows.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        value={row.bill}
                                        onChange={(e) => handleChange(index, "bill", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={row.dueDate}
                                        onChange={(e) => handleChange(index, "dueDate", e.target.value)}
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
                                {/* Delete button for each row */}
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
                            <td colSpan="2">Total</td>
                            <td>₱{total("expected").toLocaleString()}</td>
                            <td>₱{total("actual").toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={addRow} className="add-row-btn">Add Bill</button>
            </div>
        </div>
    );
};

export default BillsTable;
