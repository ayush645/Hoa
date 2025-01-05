import React, { useEffect, useState } from "react";
import { getBudgetIncomeApi } from "../services/operation/function";
import { getBudgetOutcomeApi } from "../services/operation/function";

const PrintBudgetOutcome = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState("");

  // Fetching property information (outcome data)
  useEffect(() => {
    const fetchPropertyInformation = async () => {
      try {
        setLoading(true);
        const outcomeData = await getBudgetOutcomeApi();
        const incomeData = await getBudgetIncomeApi(); // Fetch income data as well
        setPropertyData(outcomeData);
        setIncomeData(incomeData);
      } catch (error) {
        console.error("Error fetching property information:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyInformation();
  }, []);

  // Handle the year change
  const handleYearChange = (event) => {
    setYearFilter(event.target.value);
  };

  // Get unique years from property data
  const uniqueYears = [
    ...new Set(
      [...propertyData, ...incomeData].map((item) =>
        new Date(item.createdAt).getFullYear()
      )
    ),
  ];

  // Filter propertyData based on selected year
  const filteredOutcomeData = propertyData.filter((outcome) => {
    const createdAtYear = new Date(outcome.createdAt).getFullYear();
    return !yearFilter || createdAtYear.toString() === yearFilter;
  });

  const filteredIncomeData = incomeData.filter((income) => {
    const createdAtYear = new Date(income.createdAt).getFullYear();
    return !yearFilter || createdAtYear.toString() === yearFilter;
  });

  // Calculate total income and outcome
  const totalIncome = incomeData.reduce(
    (sum, item) => sum + (parseInt(item.amount) || 0),
    0
  );
  const totalOutcome = propertyData.reduce(
    (sum, item) => sum + (parseInt(item.amount) || 0),
    0
  );
  const balance = totalIncome - totalOutcome;

  if (loading) {
    return (
      <p className="text-center text-gray-500 text-lg font-semibold">
        Loading data...
      </p>
    );
  }

  if (!propertyData || propertyData.length === 0) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        No data found.
      </p>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="income-info-container p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Exceptional Budget Outcome
      </h2>

      {/* Year Filter Dropdown */}
      <div className="mb-4 flex justify-center">
        <select
          value={yearFilter}
          onChange={handleYearChange}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Years</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Expense type
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Value of Expense
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Date
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOutcomeData.map((outcome) => {
              const { type, amount, createdAt } = outcome;
              const formattedDate = new Date(createdAt).toLocaleDateString();
              const formattedTime = new Date(createdAt).toLocaleTimeString();

              return (
                <tr
                  key={outcome._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-gray-800">{type}</td>
                  <td className="px-4 py-2 text-gray-800">{amount || 0}</td>
                  <td className="px-4 py-2 text-gray-800">{formattedDate}</td>
                  <td className="px-4 py-2 text-gray-800">{formattedTime}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Display Income and Outcome Information */}
      <div className="mt-6 text-center text-white">
        <h3 className="text-xl font-semibold">Total Income: {totalIncome}</h3>
        <h3 className="text-xl font-semibold">Total Outcome: {totalOutcome}</h3>
        <h3 className="text-xl font-semibold">Balance: {balance}</h3>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default PrintBudgetOutcome;
