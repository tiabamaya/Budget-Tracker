import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Budget.css";
import { FaTrash, FaPen, FaSave, FaPlus } from "react-icons/fa";

const TransactionTable = ({ selectedMonth, onTransactionUpdate, transactions, categories }) => {
    const [transactionRows, setTransactionRows] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/api/transactions?month=" + selectedMonth)
            .then(res => setTransactionRows(res.data))
            .catch(err => console.error(err));
    }, [selectedMonth]);

    const handleInputChange = (index, field, value) => {
        const updated = [...transactionRows];
        updated[index][field] = value;
        setTransactionRows(updated);
        onTransactionUpdate(updated);
    };
    // ... rest unchanged ...



    const toggleEditRow = (index) => {
        const row = transactionRows[index];

        if (editingRowIndex === index) {
            // Save to DB
            if (!row.date || !row.amount || !row.description || !row.category) {
                alert("Fill all fields.");
                return;
            }

            const payload = { ...row, month: selectedMonth };

            if (row._id) {
                axios.put(`http://localhost:5000/api/transactions/${row._id}`, payload)
                    .then(() => setEditingRowIndex(null))
                    .catch(err => alert("Failed to update transaction."));
            } else {
                axios.post("http://localhost:5000/api/transactions", payload)
                    .then(res => {
                        const updated = [...transactionRows];
                        updated[index] = { ...payload, _id: res.data._id };
                        setTransactionRows(updated);
                        onTransactionUpdate(updated);
                        setEditingRowIndex(null);
                    })
                    .catch(err => alert("Failed to add transaction."));
            }
        } else {
            setEditingRowIndex(index);
        }
    };

    const deleteRow = (index) => {
        if (!window.confirm("Delete this transaction?")) return;

        const id = transactionRows[index]._id;
        axios.delete(`http://localhost:5000/api/transactions/${id}`)
            .then(() => {
                const updated = transactionRows.filter((_, i) => i !== index);
                setTransactionRows(updated);
                onTransactionUpdate(updated);
            })
            .catch(err => alert("Failed to delete."));
    };

    const addRow = () => {
        const newRow = { date: "", amount: "", description: "", category: "" };
        setTransactionRows([...transactionRows, newRow]);
        setEditingRowIndex(transactionRows.length);
    };

    const totalAmount = transactionRows
        .filter(row => row && row.amount)
        .reduce((sum, row) => {
            const amt = typeof row.amount === "string" ? row.amount.replace(/,/g, "") : row.amount || 0;
            return sum + parseFloat(amt);
        }, 0)
        .toLocaleString();


    return (
        <div className="container row transaction-section">
            <div className="header-section">
                <h2>Transactions - {selectedMonth}</h2>
                <button className="add-btn" onClick={addRow}>
                    <FaPlus /> Add Transaction
                </button>
            </div>
            <table className="budget-table no-action-borders">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th className="no-border"></th>
                    </tr>
                </thead>
                <tbody>
                    {transactionRows.map((row, index) => (
                        <tr key={row._id || index}>
                            <td>
                                {editingRowIndex === index ? (
                                    <input
                                        type="date"
                                        value={row.date?.substring(0, 10)}
                                        onChange={(e) => handleInputChange(index, "date", e.target.value)}
                                    />
                                ) : (
                                    row.date?.substring(0, 10)
                                )}
                            </td>
                            <td>
                                {editingRowIndex === index ? (
                                    <input
                                        value={row.amount}
                                        onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                                    />
                                ) : (
                                    `₱${parseFloat(row.amount || 0).toLocaleString()}`
                                )}
                            </td>
                            <td>
                                {editingRowIndex === index ? (
                                    <input
                                        value={row.description}
                                        onChange={(e) => handleInputChange(index, "description", e.target.value)}
                                    />
                                ) : (
                                    row.description
                                )}
                            </td>
                            <td>
                                {editingRowIndex === index ? (
                                    <select
                                        value={row.category}
                                        onChange={(e) => handleInputChange(index, "category", e.target.value)}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat, i) => (
                                            <option key={i} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                ) : (
                                    row.category
                                )}
                            </td>
                            <td className="action-icons ">
                                <button onClick={() => toggleEditRow(index)} className="icon-button">
                                    {editingRowIndex === index ? <FaSave /> : <FaPen />}
                                </button>
                                {row._id && (
                                    <button onClick={() => deleteRow(index)} className="icon-button danger">
                                        <FaTrash />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="totals">
                        <td colSpan="1" >Total</td> {/* Description */}
                        <td>₱{totalAmount}</td> {/* Amount */}
                        <td></td> {/* Category */}
                        <td></td> {/* Actions */}
                    </tr>
                </tfoot>

            </table>
        </div>
    );
};

export default TransactionTable;
