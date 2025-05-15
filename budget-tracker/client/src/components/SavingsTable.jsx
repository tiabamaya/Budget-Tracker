import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Budget.css";
import { FaTrash, FaPen, FaSave, FaPlus } from "react-icons/fa";

const SavingsTable = ({ selectedMonth, onSavingsUpdate }) => {
    const [savingsRows, setSavingsRows] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/savings?month=${selectedMonth}`)
            .then((res) => {
                setSavingsRows(res.data || []);
                onSavingsUpdate(res.data || []);
            })
            .catch((err) => console.error(err));
    }, [selectedMonth, onSavingsUpdate]);

    const handleInputChange = (index, field, value) => {
        const updated = [...savingsRows];
        updated[index][field] = value;
        setSavingsRows(updated);
        onSavingsUpdate(updated);
    };

    const toggleEditRow = (index) => {
        const row = savingsRows[index];

        if (editingRowIndex === index) {
            // Validate fields
            if (!row.category || !row.expected || !row.actual) {
                alert("Please fill all fields.");
                return;
            }

            if (row._id) {
                // Existing row - update
                axios.put(`http://localhost:5000/api/savings/${row._id}`, row)
                    .then(() => setEditingRowIndex(null))
                    .catch((err) => {
                        console.error(err);
                        alert("Failed to update saving.");
                    });
            } else {
                // New row - create
                const newSaving = { ...row, month: selectedMonth };
                axios.post(`http://localhost:5000/api/savings`, newSaving)
                    .then((res) => {
                        const newId = res.data._id;
                        const updated = [...savingsRows];
                        updated[index] = { ...newSaving, _id: newId };
                        setSavingsRows(updated);
                        onSavingsUpdate(updated);
                        setEditingRowIndex(null);
                    })
                    .catch((err) => {
                        console.error(err);
                        alert("Failed to add saving.");
                    });
            }
        } else {
            setEditingRowIndex(index);
        }
    };

    const deleteRow = (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this saving?");
        if (!confirmDelete) return;

        const idToDelete = savingsRows[index]._id;
        axios.delete(`http://localhost:5000/api/savings/${idToDelete}`)
            .then(() => {
                const updated = savingsRows.filter((_, i) => i !== index);
                setSavingsRows(updated);
                onSavingsUpdate(updated);
                alert("Saving deleted successfully!");
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to delete saving.");
            });
    };

    const addRow = () => {
        const newRow = { category: "", expected: "", actual: "" };
        setSavingsRows([...savingsRows, newRow]);
        setEditingRowIndex(savingsRows.length); // Auto-edit new row
    };

    const total = (type) => {
        return savingsRows.reduce((sum, row) => {
            const val = parseFloat(row[type] || 0);
            return sum + (isNaN(val) ? 0 : val);
        }, 0).toLocaleString();
    };

    return (
        <div className="container row savings-section">
            <div className="header-section">
                <h2>Savings - {selectedMonth}</h2>
                <button className="add-btn" onClick={addRow}>
                    <FaPlus /> Add Saving
                </button>
            </div>
            <table className="budget-table no-action-borders">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Expected</th>
                        <th>Actual</th>
                        <th className="no-border"></th>
                    </tr>
                </thead>
                <tbody>
                    {savingsRows.map((row, index) => (
                        <tr key={row._id || index}>
                            <td>
                                {editingRowIndex === index ? (
                                    <input
                                        value={row.category}
                                        onChange={(e) => handleInputChange(index, "category", e.target.value)}
                                    />
                                ) : (
                                    row.category
                                )}
                            </td>
                            <td>
                                {editingRowIndex === index ? (
                                    <input
                                        value={row.expected}
                                        onChange={(e) => handleInputChange(index, "expected", e.target.value)}
                                    />
                                ) : (
                                    `₱${parseFloat(row.expected || 0).toLocaleString()}`
                                )}
                            </td>
                            <td>
                                {editingRowIndex === index ? (
                                    <input
                                        value={row.actual}
                                        onChange={(e) => handleInputChange(index, "actual", e.target.value)}
                                    />
                                ) : (
                                    `₱${parseFloat(row.actual || 0).toLocaleString()}`
                                )}
                            </td>
                            <td className="action-icons">
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
                        <td>Total</td>
                        <td>₱{total("expected")}</td>
                        <td>₱{total("actual")}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default SavingsTable;
