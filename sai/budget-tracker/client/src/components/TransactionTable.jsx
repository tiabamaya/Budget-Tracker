import React, { useState } from "react";
import "../styles/Budget.css";

const TransactionTable = ({ expensesData, onTransactionAdd, categories }) => {

    const [transactions, setTransactions] = useState([
        { date: "", amount: "", description: "", category: "" },
    ]);

    const formatNumberWithCommas = (value) => {
        const num = parseFloat(value.replace(/,/g, ""));
        return isNaN(num) ? "" : num.toLocaleString();
    };

    // Define the updateCategoryActual function
    const updateCategoryActual = (category, amount) => {
        // Find the corresponding expense category
        const updatedExpensesData = expensesData.map((expense) => {
            if (expense.category === category) {
                const updatedAmount = parseFloat(expense.actual || 0) + amount;
                return { ...expense, actual: updatedAmount.toString() };
            }
            return expense;
        });

        // Call the parent method to update the expenses data
        onTransactionAdd(updatedExpensesData);
    };

    const handleChange = (index, field, value) => {
        const updated = [...transactions];
        updated[index][field] = value;

        // Trigger update only if both category and amount are valid
        if (field === "category" || field === "amount") {
            const amount = parseFloat(updated[index].amount.replace(/,/g, "")) || 0;
            if (updated[index].category) {
                updateCategoryActual(updated[index].category, amount);
            }
        }

        setTransactions(updated);
        onTransactionAdd(updated);
    };

    const handleInputChange = (e, index, key) => {
        const input = e.target.value.replace(/,/g, "");
        if (!isNaN(input)) {
            const updated = [...transactions];
            updated[index][key] = input;

            // Recalculate only if category is selected
            if (key === "amount" && updated[index].category) {
                const amount = parseFloat(input) || 0;
                updateCategoryActual(updated[index].category, amount);
            }

            setTransactions(updated);
            onTransactionAdd(updated);
        }
    };

    const addRow = () => {
        const newRows = [...transactions, { date: "", amount: "", description: "", category: "" }];
        setTransactions(newRows);
    };

    const deleteRow = (index) => {
        const updatedRows = transactions.filter((_, i) => i !== index);
        setTransactions(updatedRows);
        onTransactionAdd(updatedRows);
    };

    return (
        <div className="container">
            <div className="section">
                <h2>Transactions</h2>
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="date"
                                        value={tx.date}
                                        onChange={(e) => handleChange(index, "date", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={formatNumberWithCommas(tx.amount || "")}
                                        onChange={(e) => handleInputChange(e, index, "amount")}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={tx.description}
                                        onChange={(e) => handleChange(index, "description", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={tx.category}
                                        onChange={(e) => handleChange(index, "category", e.target.value)}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
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
                    </tbody>
                </table>
                <button onClick={addRow} className="add-row-btn">Add Transaction</button>
            </div>
        </div>
    );
};

export default TransactionTable;
