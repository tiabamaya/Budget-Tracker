import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Budget.css";
import { FaTrash, FaPen, FaSave, FaPlus } from "react-icons/fa";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


const IncomeTable = ({ selectedMonth, onIncomeUpdate }) => {
  const [incomeRows, setIncomeRows] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/incomes?month=${selectedMonth}`)
      .then((res) => {
        const data = res.data.length > 0 ? res.data : [];
        setIncomeRows(data);
        onIncomeUpdate(data);
      })
      .catch((err) => console.error(err));
  }, [selectedMonth, onIncomeUpdate]);

  const selectedMonthIndex = months.indexOf(selectedMonth);
  const currentYear = new Date().getFullYear();

  // Format to YYYY-MM-DD
  const minDate = `${currentYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}-01`;
  const maxDate = new Date(currentYear, selectedMonthIndex + 1, 0).toISOString().split('T')[0];


  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US', options);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...incomeRows];
    updatedRows[index][field] = value;
    setIncomeRows(updatedRows);
    onIncomeUpdate(updatedRows);
  };

  const toggleEditRow = (index) => {
    const row = incomeRows[index];

    if (editingRowIndex === index) {
      if (row._id) {
        // Existing row -> update
        axios.put(`http://localhost:5000/api/incomes/${row._id}`, row)
          .then(() => {
            setEditingRowIndex(null);
          })
          .catch((err) => {
            console.error(err);
            alert("Failed to update income.");
          });
      } else {
        // New row -> create
        const newIncome = { ...row, month: selectedMonth };

        axios.post(`http://localhost:5000/api/incomes`, newIncome)
          .then((res) => {
            const newId = res.data._id;
            const updatedRows = [...incomeRows];
            updatedRows[index] = { ...newIncome, _id: newId };
            setIncomeRows(updatedRows);
            onIncomeUpdate(updatedRows);
            setEditingRowIndex(null);
          })
          .catch((err) => {
            console.error(err);
            alert("Failed to add income.");
          });
      }
    } else {
      setEditingRowIndex(index);
    }
  };



  const deleteRow = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this income?");
    if (!confirmDelete) return;

    const idToDelete = incomeRows[index]._id;

    axios.delete(`http://localhost:5000/api/incomes/${idToDelete}`)
      .then(() => {
        const updatedRows = incomeRows.filter((_, i) => i !== index);
        setIncomeRows(updatedRows);
        onIncomeUpdate(updatedRows);
        alert("Income deleted successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete income.");
      });
  };

  const addRow = () => {
    const newRow = { source: "", date: "", expected: "", actual: "" };
    setIncomeRows([...incomeRows, newRow]);
    setEditingRowIndex(incomeRows.length); // New row editable immediately
  };

  const total = (type) => {
    return incomeRows.reduce((sum, row) => {
      const value = parseFloat(row[type] || 0);
      return sum + (isNaN(value) ? 0 : value);
    }, 0).toLocaleString();
  };
  return (
    <div className="container row income-section">
      <div className="income-header">
        <h2>Income - {selectedMonth}</h2>
      </div>
      <div>
        <button className="add-btn" onClick={addRow}>
          <FaPlus /> Add Income
        </button>
        <table className="budget-table no-action-borders">
          <thead>
            <tr>
              <th>Source</th>
              <th>Date</th>
              <th>Expected</th>
              <th>Actual</th>
              <th className="no-border"></th>
            </tr>
          </thead>
          <tbody>
            {incomeRows.map((row, index) => (
              <tr key={row._id || index}>
                <td>
                  {editingRowIndex === index ? (
                    <input
                      value={row.source}
                      onChange={(e) => handleInputChange(index, "source", e.target.value)}
                    />
                  ) : (
                    row.source
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
                      onKeyDown={(e) => e.preventDefault()} // Optional to lock typing
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
              <td colSpan="2">Total</td>
              <td>₱{total("expected")}</td>
              <td>₱{total("actual")}</td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

export default IncomeTable;