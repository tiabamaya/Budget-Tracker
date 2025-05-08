import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import "../styles/Budget.css";

const COLORS = ["#F49FB6", "#F7C59F", "#C8D5B9", "#8EABC1", "#B5A886"];
const renderCustomizedLabel = ({ percent }) =>
    `${(percent * 100).toFixed(1)}%`;

const currencyFormatter = (value) => `₱${parseFloat(value || 0).toLocaleString()}`;

const Summary = ({ incomeData, billData, expenseData, savingData, debtData }) => {
    const sum = (arr, key) =>
        arr.reduce((total, row) => total + parseFloat(row[key] || 0), 0);

    const totals = {
        income: sum(incomeData, "actual"),
        bills: sum(billData, "actual"),
        expenses: sum(expenseData, "actual"),
        savings: sum(savingData, "actual"),
        debt: sum(debtData, "actual"),
    };

    const expected = {
        income: sum(incomeData, "expected"),
        bills: sum(billData, "expected"),
        expenses: sum(expenseData, "expected"),
        savings: sum(savingData, "expected"),
        debt: sum(debtData, "expected"),
    };

    const budgetLeft = expected.income - (expected.bills + expected.expenses + expected.savings + expected.debt);

    const barData = [
        { name: "Bills", Expected: expected.bills, Actual: totals.bills },
        { name: "Expenses", Expected: expected.expenses, Actual: totals.expenses },
        { name: "Savings", Expected: expected.savings, Actual: totals.savings },
        { name: "Debt", Expected: expected.debt, Actual: totals.debt },
    ];

    const incomeBarData = [
        { name: "Income", Expected: expected.income, Actual: totals.income },
    ];

    const pieData = [
        { name: "Bills", value: expected.bills },
        { name: "Expenses", value: expected.expenses },
        { name: "Savings", value: expected.savings },
        { name: "Debt", value: expected.debt },
    ];

    return (
        <div className="summary-section">
            <div className="summary-status-box">
                <div className="status-item">
                    <p className="status-label">Amount Left to Budget</p>
                    <p className="status-value">{currencyFormatter(budgetLeft)}</p>
                </div>
                <div className="status-item">
                    <p className="status-label">Amount Left to Spend</p>
                    <p className="status-value">{currencyFormatter(totals.income - (totals.bills + totals.expenses + totals.savings + totals.debt))}</p>
                </div>
            </div>
            <h2>Budget Status</h2>
            <div className="summary-totals">
                <p>Income: {currencyFormatter(totals.income)}</p>
                <p>Bills: {currencyFormatter(totals.bills)}</p>
                <p>Expenses:{currencyFormatter(totals.expenses)}</p>
                <p>Savings: {currencyFormatter(totals.savings)}</p>
                <p>Debt: {currencyFormatter(totals.debt)}</p>
                <p>Total Spent: {currencyFormatter(totals.bills + totals.expenses + totals.savings + totals.debt)}</p>
            </div>

            <div className="charts-container">
                <div className="chart-box">
                    <h3>Income (Expected vs. Actual)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={incomeBarData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={currencyFormatter} />
                            <Legend />
                            <Bar dataKey="Expected" fill="#F7C59F" />
                            <Bar dataKey="Actual" fill="#C8D5B9" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-box">
                    <h3>Spending (Expected vs Actual)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={currencyFormatter} />
                            <Legend />
                            <Bar dataKey="Expected" fill="#F49FB6" />
                            <Bar dataKey="Actual" fill="#8EABC1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-box">
                    <h3>Spending Breakdown of Expected Budget</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label={renderCustomizedLabel}
                                labelLine={false}
                            >
                                {pieData.map((_, i) => (
                                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={currencyFormatter} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Summary;
