import React, { useState } from "react";
import axios from "axios";
import { FaTrash, FaPen, FaSave, FaPlus } from "react-icons/fa";

const VariableExpensesTable = ({ selectedMonth, variableExpenses, transactions = [], onUpdate }) => {
    const [editingIndex, setEditingIndex] = useState(null);

    const handleInputChange = (index, field, value) => {
        const updated = [...variableExpenses];
        updated[index][field] = value;
        onUpdate(updated);
    };

    const toggleEditRow = (index) => {
        const row = variableExpenses[index];

        if (editingIndex === index) {
            if (!row.category || !row.expected) {
                alert("Category and Expected are required.");
                return;
            }

            if (row._id) {
                axios.put(`http://localhost:5000/api/expenses/${row._id}`, row)
                    .then(() => setEditingIndex(null))
                    .catch((err) => console.error(err));
            } else {
                axios.post(`http://localhost:5000/api/expenses`, row)
                    .then((res) => {
                        const updated = [...variableExpenses];
                        updated[index] = { ...row, _id: res.data._id };
                        onUpdate(updated);
                        setEditingIndex(null);
                    })
                    .catch((err) => console.error(err));
            }
        } else {
            setEditingIndex(index);
        }
    };

    const deleteRow = (index) => {
        const idToDelete = variableExpenses[index]._id;
        if (!idToDelete) return;

        axios.delete(`http://localhost:5000/api/expenses/${idToDelete}`)
            .then(() => {
                const updated = variableExpenses.filter((_, i) => i !== index);
                onUpdate(updated);
            })
            .catch((err) => console.error(err));
    };

    const addRow = () => {
        const newRow = { category: "", expected: "", month: selectedMonth };
        onUpdate([...variableExpenses, newRow]);
        setEditingIndex(variableExpenses.length);
    };

    const calculateActual = (category) => {
        return transactions
            .filter((t) => t.category === category)
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
            .toLocaleString();
    };

    const totalExpected = variableExpenses
        .filter(row => row)
        .reduce((sum, row) => sum + parseFloat(row.expected || 0), 0)
        .toLocaleString();

    const totalActual = variableExpenses
        .filter(row => row)
        .reduce((sum, row) => {
            const actual = transactions
                .filter((t) => t.category === row.category)
                .reduce((s, t) => s + parseFloat(t.amount || 0), 0);
            return sum + actual;
        }, 0)
        .toLocaleString();


    return (
        <div className="section">
            <h2>Variable Expenses - {selectedMonth}</h2>
            <button onClick={addRow} className="add-btn"><FaPlus /> Add</button>
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
                    {variableExpenses.map((row, index) => (
                        <tr key={row._id || index}>
                            <td>
                                {editingIndex === index ? (
                                    <input value={row.category} onChange={(e) => handleInputChange(index, "category", e.target.value)} />
                                ) : (
                                    row.category
                                )}
                            </td>
                            <td>
                                {editingIndex === index ? (
                                    <input value={row.expected} onChange={(e) => handleInputChange(index, "expected", e.target.value)} />
                                ) : (
                                    `₱${parseFloat(row.expected || 0).toLocaleString()}`
                                )}
                            </td>
                            <td>₱{calculateActual(row.category)}</td>
                            <td className="action-icons">
                                <button onClick={() => toggleEditRow(index)} className="icon-button">
                                    {editingIndex === index ? <FaSave /> : <FaPen />}
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
                        <td>₱{totalExpected}</td>
                        <td>₱{totalActual}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default VariableExpensesTable;
