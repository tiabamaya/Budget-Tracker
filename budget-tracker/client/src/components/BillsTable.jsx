import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Budget.css";
import { FaTrash, FaPen, FaSave, FaPlus } from "react-icons/fa";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const BillsTable = ({ selectedMonth, onBillsUpdate }) => {
    const [billRows, setBillRows] = useState([]);
    const [editingRowIndex, setEditingRowIndex] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/bills?month=${selectedMonth}`)
            .then((res) => {
                const data = res.data.length > 0 ? res.data : [];
                setBillRows(data);
                onBillsUpdate(data);
            })
            .catch((err) => console.error(err));
    }, [selectedMonth, onBillsUpdate]);

    const selectedMonthIndex = months.indexOf(selectedMonth);
    const currentYear = new Date().getFullYear();

    const minDate = `${currentYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}-01`;
    const maxDate = new Date(currentYear, selectedMonthIndex + 1, 0).toISOString().split("T")[0];

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'long', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...billRows];
        updatedRows[index][field] = value;
        setBillRows(updatedRows);
        onBillsUpdate(updatedRows);
    };

    const toggleEditRow = (index) => {
        const row = billRows[index];

        if (editingRowIndex === index) {
            if (row._id) {
                axios.put(`http://localhost:5000/api/bills/${row._id}`, row)
                    .then(() => setEditingRowIndex(null))
                    .catch((err) => {
                        console.error(err);
                        alert("Failed to update bill.");
                    });
            } else {
                const newBill = { ...row, month: selectedMonth };
                axios.post(`http://localhost:5000/api/bills`, newBill)
                    .then((res) => {
                        const newId = res.data._id;
                        const updatedRows = [...billRows];
                        updatedRows[index] = { ...newBill, _id: newId };
                        setBillRows(updatedRows);
                        onBillsUpdate(updatedRows);
                        setEditingRowIndex(null);
                    })
                    .catch((err) => {
                        console.error(err);
                        alert("Failed to add bill.");
                    });
            }
        } else {
            setEditingRowIndex(index);
        }
    };

    const deleteRow = (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this bill?");
        if (!confirmDelete) return;

        const idToDelete = billRows[index]._id;

        axios.delete(`http://localhost:5000/api/bills/${idToDelete}`)
            .then(() => {
                const updatedRows = billRows.filter((_, i) => i !== index);
                setBillRows(updatedRows);
                onBillsUpdate(updatedRows);
                alert("Bill deleted successfully!");
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to delete bill.");
            });
    };

    const addRow = () => {
        const defaultDate = minDate;
        const newRow = { bill: "", date: defaultDate, expected: "", actual: "" };
        setBillRows([...billRows, newRow]);
        setEditingRowIndex(billRows.length);
    };

    const total = (type) => {
        return billRows.reduce((sum, row) => {
            const value = parseFloat(row[type] || 0);
            return sum + (isNaN(value) ? 0 : value);
        }, 0).toLocaleString();
    };

    return (
        <div className="container row bills-section">
            <div className="income-header">
                <h2>Bills - {selectedMonth}</h2>
            </div>
            <div>
                <button className="add-btn" onClick={addRow}>
                    <FaPlus /> Add Bill
                </button>
                <table className="budget-table no-action-borders">
                    <thead>
                        <tr>
                            <th>Bill</th>
                            <th>Date</th>
                            <th>Expected</th>
                            <th>Actual</th>
                            <th className="no-border"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {billRows.map((row, index) => (
                            <tr key={row._id || index}>
                                <td>
                                    {editingRowIndex === index ? (
                                        <input
                                            value={row.bill}
                                            onChange={(e) => handleInputChange(index, "bill", e.target.value)}
                                        />
                                    ) : (
                                        row.bill
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

export default BillsTable;
