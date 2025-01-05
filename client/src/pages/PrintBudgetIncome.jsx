import React, { useEffect, useState } from "react";
import { getBudgetIncomeApi } from "../services/operation/function";

const PrintBudgetIncome = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    const fetchPropertyInformation = async () => {
      try {
        setLoading(true);
        const data = await getBudgetIncomeApi();
        setPropertyData(data);
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
      propertyData.map((outcome) => new Date(outcome.createdAt).getFullYear())
    ),
  ];

  // Filter propertyData based on selected year
  const filteredData = propertyData.filter((outcome) => {
    const createdAtYear = new Date(outcome.createdAt).getFullYear();
    return !yearFilter || createdAtYear.toString() === yearFilter;
  });

  // Calculate the total income
  const totalIncome = filteredData.reduce(
    (total, outcome) => total + (parseInt(outcome.amount) || 0),
    0
  );

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
        Exceptional Budget Income
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
                Owners
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Contribution
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
            {filteredData.map((outcome) => {
              const { name, amount, createdAt } = outcome;
              const formattedDate = new Date(createdAt).toLocaleDateString();
              const formattedTime = new Date(createdAt).toLocaleTimeString();

              return (
                <tr
                  key={outcome._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-gray-800">{name}</td>
                  <td className="px-4 py-2 text-gray-800">{amount || 0}</td>
                  <td className="px-4 py-2 text-gray-800">{formattedDate}</td>
                  <td className="px-4 py-2 text-gray-800">{formattedTime}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Total Income */}
      <div className="mt-6 text-center">
        <p className="text-lg text-white font-semibold">
          Total Income: ₹{totalIncome}
        </p>
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

export default PrintBudgetIncome;
