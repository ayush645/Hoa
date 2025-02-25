import React, { useState } from 'react';
import ExpenseTable from '../components/document/ReguralOutcome';
import BudgetOutcomeTable from '../components/document/BugdetOutcome';

const BudgetOutcomeList = () => {
    const [activeTab, setActiveTab] = useState("expense"); // Default: Show ExpenseTable

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-white">Budget & Expenses</h2>

            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${activeTab === "expense" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("expense")}
                >
                    Expense Table
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === "budget" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("budget")}
                >
                    Budget Outcome Table
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === "both" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("both")}
                >
                    Both
                </button>
            </div>

            {/* Render Content Based on Active Tab */}
            {activeTab === "expense" && <ExpenseTable />}
            {activeTab === "budget" && <BudgetOutcomeTable />}
            {activeTab === "both" && (
                <>
                    <ExpenseTable />
                    <BudgetOutcomeTable />
                </>
            )}
        </div>
    );
};

export default BudgetOutcomeList;
