import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import {
  getAllOutcomeApi,
  updateMonthOutComeApi,
} from "../services/operation/function";
import { toast } from "react-toastify";

const GetOutCome = ({ propertyData, loading, onDelete, id }) => {
  const [yearFilter, setYearFilter] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null);
  const [amount, setAmount] = useState("");
  const [incomeData, setIncomeData] = useState(propertyData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIncomeData(propertyData);
  }, [propertyData]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 text-lg font-semibold">
        Loading income information...
      </p>
    );
  }

  if (!incomeData || incomeData.length === 0) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        No income information found.
      </p>
    );
  }

  const handleYearChange = (event) => {
    setYearFilter(event.target.value);
  };

  const filteredData = incomeData.filter((income) => {
    const createdAt = new Date(income.createdAt);
    const year = createdAt.getFullYear();
    return !yearFilter || year.toString() === yearFilter;
  });

  const handleMonthClick = (incomeId, month) => {
    setSelectedIncomeId(incomeId);
    setSelectedMonth(month);

    const selectedIncome = filteredData.find(
      (income) => income._id === incomeId
    );
    if (selectedIncome) {
      setAmount(selectedIncome.months[month] || 0);
      setIsModalOpen(true);
    }
  };

  const fetchIncome = async () => {
    try {
      const data = await getAllOutcomeApi(id);
      setIncomeData(data);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedIncomeId || !selectedMonth) {
      toast.error("No income or month selected.");
      return;
    }

    try {
      const result = await updateMonthOutComeApi(
        selectedIncomeId,
        selectedMonth,
        parseFloat(amount)
      );

      if (result) {
        toast.success("Month updated successfully");
        setSelectedMonth(null);
        setSelectedIncomeId(null);
        fetchIncome();
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Error updating the month. Please try again.");
    }
  };

  const totalContribution = incomeData.reduce(
    (sum, income) => sum + income.contribution,
    0
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthlyTotals = {};
  months.forEach((month) => {
    monthlyTotals[month] = incomeData.reduce(
      (sum, income) => sum + (income.months[month] || 0),
      0
    );
  });

  return (
    <div className="income-info-container p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        OutCome Information
      </h2>

      {/* Year Filter Dropdown */}
      <div className="mb-4 flex justify-center">
        <select
          value={yearFilter}
          onChange={handleYearChange}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Years</option>
          {Array.from(
            new Set(
              incomeData.map((income) =>
                new Date(income.createdAt).getFullYear()
              )
            )
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Expenses
              </th>
              {months.map((month) => (
                <th
                  key={month}
                  className="px-4 py-2 text-left text-gray-600 font-semibold"
                >
                  {month}
                </th>
              ))}
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Total
              </th>
              <th className="px-4 py-2 text-center text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((income) => (
              <tr
                key={income._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2 text-gray-800">{income.expense}</td>
                {months.map((month) => (
                  <td
                    key={month}
                    className="px-4 py-2 text-gray-800 cursor-pointer"
                    onClick={() => handleMonthClick(income._id, month)}
                  >
                    {income.months[month] || 0}
                  </td>
                ))}
                <td className="px-4 py-2 text-gray-800">
                  {income.contribution}
                </td>
                <td className="px-4 py-2 text-center">
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => onDelete(income._id)}
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="px-4 py-2 text-gray-800">Total</td>
              {months.map((month) => (
                <td key={month} className="px-4 py-2 text-gray-800">
                  {monthlyTotals[month]}
                </td>
              ))}
              <td className="px-4 py-2 text-gray-800"></td>
              <td className="px-4 py-2 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Update Payment for {selectedMonth}
            </h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Total Calculation */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Total Contributions:</h3>
        <ul>
          {Object.entries(monthlyTotals).map(([month, total]) => (
            <li key={month} className="text-gray-800">
              {month}: {total}
            </li>
          ))}
        </ul>
        <p className="text-lg font-bold text-gray-700 mt-4">
          Grand Total: {totalContribution}
        </p>
      </div>
    </div>
  );
};

export default GetOutCome;
