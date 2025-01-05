import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import {
  getAllIncomeApi,
  updateMonthIncomeApi,
} from "../services/operation/function";
import { toast } from "react-toastify";

const GetIncome = ({ propertyData, loading, onDelete, id }) => {
  const [yearFilter, setYearFilter] = useState(""); // State to store selected year
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null); // New state to store selected income ID
  const [paymentStatus, setPaymentStatus] = useState("Not Paid");
  const [partialAmount, setPartialAmount] = useState(0);
  const [incomeData, setIncomeData] = useState(propertyData); // Added state to store fetched income data
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [selectedIncomeData, setSelectedIncomeData] = useState(null); // Store selected income data for the modal
  const [paymentType, setPaymentType] = useState("");
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

  // Handle the year change
  const handleYearChange = (event) => {
    setYearFilter(event.target.value);
  };

  // Filter incomeData based on selected year
  const filteredData = incomeData.filter((income) => {
    const createdAt = new Date(income.createdAt); // Convert ISO string to Date
    const year = createdAt.getFullYear(); // Get the year from Date
    return !yearFilter || year.toString() === yearFilter; // Filter by year
  });

  // Handle month click
  const handleMonthClick = (incomeId, month) => {
    setSelectedIncomeId(incomeId); // Set selected income ID
    setSelectedMonth(month);

    // Get selected income data
    const selectedIncome = filteredData.find(
      (income) => income._id === incomeId
    );
    if (selectedIncome) {
      setSelectedIncomeData(selectedIncome); // Set selected income data for modal
      setIsModalOpen(true); // Open the modal
    }
  };

  const fetchIncome = async () => {
    try {
      const data = await getAllIncomeApi(id);
      console.log(data);
      setIncomeData(data);
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };

  const handleSubmit = async () => {
    let amountToUpdate = 0;

    // Ensure we have the selectedIncomeId and the selected month
    if (!selectedIncomeId) {
      toast.error("No income selected."); // Show error using toast
      return;
    }

    const income = filteredData.find(
      (income) => income._id === selectedIncomeId
    );

    if (!income) {
      toast.error("Income data not found."); // Show error using toast
      return;
    }

    if (paymentStatus === "Not Paid") {
      amountToUpdate = 0;
    } else if (paymentStatus === "Full Paid") {
      // Use the contribution from the selected income
      amountToUpdate = income.contribution;
    } else if (paymentStatus === "Partially Paid") {
      // Ensure partialAmount is a valid number
      const validPartialAmount = parseFloat(partialAmount);
      if (isNaN(validPartialAmount) || validPartialAmount <= 0) {
        toast.error("Please enter a valid partial amount.");
        return;
      }
      amountToUpdate = validPartialAmount;
    }

    try {
      const result = await updateMonthIncomeApi(
        selectedIncomeId, // Send the specific incomeId
        selectedMonth,
        amountToUpdate
      );

      if (result) {
        toast.success("Month updated successfully"); // Success toast
        setSelectedMonth(null);
        setSelectedIncomeId(null); // Clear selectedIncomeId
        fetchIncome(); // Re-fetch income data after the update
        setIsModalOpen(false); // Close the modal after update
      }
    } catch (error) {
      toast.error("Error updating the month. Please try again."); // Error toast
    }
  };

  // Calculate the total amount for all users
  const totalContribution = incomeData.reduce(
    (sum, income) => sum + income.contribution,
    0
  );

  // List of all months
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

  // Calculate monthly totals and deficits for each month
  const monthlyTotals = {};
  const monthlyDeficits = {};

  months.forEach((month) => {
    const monthlyTotal = incomeData.reduce(
      (sum, income) => sum + (income.months[month] || 0),
      0
    );
    monthlyTotals[month] = monthlyTotal;
    monthlyDeficits[month] =
      incomeData.reduce((sum, income) => sum + income.contribution, 0) -
      monthlyTotal; // Deficit is the contribution - total for that month
  });

  const currentDate = new Date(); // Use real current date

  const isFutureMonth = (month) => {
    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) return false;
    const selectedDate = new Date(currentDate.getFullYear(), monthIndex, 1);
    return selectedDate > currentDate;
  };

  return (
    <div className="income-info-container p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Income Information
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
              incomeData.map((income) => {
                const createdAt = new Date(income.createdAt); // Convert ISO string to Date
                return createdAt.getFullYear(); // Get the year from Date
              })
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
                Owner Name
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Contribution
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
                Total Amount
              </th>
              <th className="px-4 py-2 text-center text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((income) => {
              const totalAmount = Object.values(income.months).reduce(
                (sum, value) => sum + value,
                0
              );
              return (
                <tr
                  key={income._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-gray-800">
                    {income.ownerName}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {income.contribution}
                  </td>
                  {months.map((month) => {
                    const monthAmount = income.months[month] || 0;

                    // Determine the background color based on conditions
                    const bgColor =
                      monthAmount === income.contribution
                        ? "bg-green-500 text-white"
                        : monthAmount === 0
                        ? "bg-red-500 text-white"
                        : monthAmount < income.contribution
                        ? "bg-orange-500 text-white"
                        : "bg-white";

                    return (
                      <td
                        key={month}
                        className={`px-4 py-2 ${bgColor} cursor-pointer border`}
                        onClick={() => handleMonthClick(income._id, month)}
                      >
                        {monthAmount}
                      </td>
                    );
                  })}

                  <td className="px-4 py-2 text-gray-800">{totalAmount}</td>
                  <td className="px-4 py-2 text-center">
                    <FaTrash
                      className="text-red-500 cursor-pointer"
                      onClick={() => onDelete(income._id)}
                    />
                  </td>
                </tr>
              );
            })}

            {/* Footer Row for Total */}
            <tr className="bg-gray-100 font-bold">
              <td className="px-4 py-2 text-gray-800">Total</td>
              <td className="px-4 py-2 text-gray-800">{totalContribution}</td>
              {months.map((month) => (
                <td key={month} className="px-4 py-2 text-gray-800">
                  {monthlyTotals[month]}
                </td>
              ))}
              <td className="px-4 py-2 text-gray-800"></td>
              <td className="px-4 py-2 text-center"></td>
            </tr>

            {/* Footer Row for Deficit */}
            <tr className="bg-gray-100 font-bold">
              <td className="px-4 py-2 text-gray-800">Deficit</td>
              <td className="px-4 py-2 text-gray-800">-</td>
              {months.map((month) => (
                <td key={month} className="px-4 py-2 text-gray-800">
                  {monthlyDeficits[month] || 0}
                </td>
              ))}
              <td className="px-4 py-2 text-gray-800"></td>
              <td className="px-4 py-2 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-800">
                Year: <span className="font-medium">{yearFilter}</span>
              </h3>
              <h3 className="text-xl font-bold text-gray-800">
                Month: <span className="font-medium">{selectedMonth}</span>
              </h3>
              <h3 className="text-xl font-bold text-gray-800">
                Owner:{" "}
                <span className="font-medium">
                  {selectedIncomeData.ownerName}
                </span>
              </h3>
              <h3 className="text-xl font-bold text-gray-800">
                Monthly Amount:{" "}
                <span className="font-medium">
                  {selectedIncomeData.contribution}
                </span>
              </h3>
            </div>

            <div className="space-y-4">
              {/* Payment Status Section */}
              <div>
                <label
                  htmlFor="paymentStatus"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
                    paymentStatus === "Not Paid"
                      ? "bg-red-500 text-white"
                      : paymentStatus === "Full Paid"
                      ? "bg-green-500 text-white"
                      : paymentStatus === "Partially Paid"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <option value="Not Paid">Not Paid</option>
                  <option value="Full Paid">Full Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                </select>
              </div>

              {/* Partial Amount Input */}
              {paymentStatus === "Partially Paid" && (
                <div>
                  <label
                    htmlFor="partialAmount"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Partial Amount
                  </label>
                  <input
                    type="number"
                    id="partialAmount"
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                    className="w-full px-4 py-2 border bg-yellow-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Payment Type Section */}
              <div>
                <label
                  htmlFor="paymentType"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Payment Type
                </label>
                <select
                  id="paymentType"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-md hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetIncome;
