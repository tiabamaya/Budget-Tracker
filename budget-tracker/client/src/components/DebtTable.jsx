import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Budget.css";
import { FaTrash, FaPen, FaSave, FaPlus } from "react-icons/fa";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DebtTable = ({ selectedMonth, onDebtUpdate }) => {
    const [debtRows, setDebtRows] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/debts?month=${selectedMonth}`)
            .then((res) => {
                const data = res.data.length > 0 ? res.data : [];
                setDebtRows(data);
                onDebtUpdate(data);
            })
            .catch((err) => console.error(err));
    }, [selectedMonth, onDebtUpdate]);

    const selectedMonthIndex = months.indexOf(selectedMonth);
    const currentYear = new Date().getFullYear();

    const minDate = `${currentYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}-01`;
    const maxDate = new Date(currentYear, selectedMonthIndex + 1, 0).toISOString().split('T')[0];

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'long', day: '2-digit' };
        const dateObj = new Date(dateString);
        return dateObj.toLocaleDateString('en-US', options);
    };


    const handleInputChange = (index, field, value) => {
        const updatedRows = [...debtRows];
        updatedRows[index][field] = value;
        setDebtRows(updatedRows);
        onDebtUpdate(updatedRows);
    };

    const toggleEditRow = (index) => {
        const row = debtRows[index];

        if (editingRowIndex === index) {
            // Validate required fields before sending to backend
            if (!row.debt || !row.date || !row.expected || !row.actual) {
                alert("Please fill in all fields before saving.");
                return;
            }

            if (row._id) {
                axios.put(`http://localhost:5000/api/debts/${row._id}`, row)
                    .then(() => setEditingRowIndex(null))
                    .catch((err) => {
                        console.error(err);
                        alert("Failed to update debt.");
                    });
            } else {
                const newDebt = { ...row, month: selectedMonth };
                axios.post(`http://localhost:5000/api/debts`, newDebt)
                    .then((res) => {
                        const newId = res.data._id;
                        const updatedRows = [...debtRows];
                        updatedRows[index] = { ...newDebt, _id: newId };
                        setDebtRows(updatedRows);
                        onDebtUpdate(updatedRows);
                        setEditingRowIndex(null);
                    })
                    .catch((err) => {
                        console.error(err);
                        alert("Failed to add debt.");
                    });
            }
        } else {
            setEditingRowIndex(index);
        }
    };

    const deleteRow = (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this debt?");
        if (!confirmDelete) return;

        const idToDelete = debtRows[index]._id;
        axios.delete(`http://localhost:5000/api/debts/${idToDelete}`)
            .then(() => {
                const updatedRows = debtRows.filter((_, i) => i !== index);
                setDebtRows(updatedRows);
                onDebtUpdate(updatedRows);
                alert("Debt deleted successfully!");
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to delete debt.");
            });
    };

    const addRow = () => {
        const today = new Date();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        let defaultDate;
        if (todayMonth === selectedMonthIndex && todayYear === currentYear) {
            defaultDate = today.toISOString().split('T')[0];
        } else {
            defaultDate = minDate;
        }

        const newRow = { debt: "", date: defaultDate, expected: "", actual: "" };
        setDebtRows([...debtRows, newRow]);
        setEditingRowIndex(debtRows.length); // New row editable immediately
    };


    const total = (type) => {
        return debtRows.reduce((sum, row) => {
            const value = parseFloat(row[type] || 0);
            return sum + (isNaN(value) ? 0 : value);
        }, 0).toLocaleString();
    };

    return (
        <div className="container row debt-section">
            <div className="income-header">
                <h2>Debts - {selectedMonth}</h2>
            </div>
            <div>
                <button className="add-btn" onClick={addRow}>
                    <FaPlus /> Add Debt
                </button>
                <table className="budget-table no-action-borders">
                    <thead>
                        <tr>
                            <th>Debt</th>
                            <th>Date</th>
                            <th>Expected</th>
                            <th>Actual</th>
                            <th className="no-border"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {debtRows.map((row, index) => (
                            <tr key={row._id || index}>
                                <td>
                                    {editingRowIndex === index ? (
                                        <input
                                            value={row.debt}
                                            onChange={(e) => handleInputChange(index, "debt", e.target.value)}
                                        />
                                    ) : (
                                        row.debt
                                    )}
                                </td>
                                <td>
                                    {editingRowIndex === index ? (
                                        <input
                                            type="date"
                                            value={row.date?.substring(0, 10)}
                                            min={minDate}
                                            max={maxDate}
                                            onChange={(e) => handleInputChange(index, "date", e.target.value)}
                                            onKeyDown={(e) => e.preventDefault()}
                                        />
                                    ) : (
                                        formatDate(row.date)
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
                                    <button onClick={() => deleteRow(index)} className="icon-button danger">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="totals">
                            <td colSpan="1">Total</td>
                            <td>₱{total("expected")}</td>
                            <td>₱{total("actual")}</td>
                            <td className="no-border"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default DebtTable;
