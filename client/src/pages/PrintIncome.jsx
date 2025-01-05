import React, { useEffect, useState } from "react";
import { getIncomeApi } from "../services/operation/function";

const PrintIncome = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    const fetchPropertyInformation = async () => {
      try {
        setLoading(true);
        const data = await getIncomeApi();
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
      propertyData.map((income) => new Date(income.createdAt).getFullYear())
    ),
  ];

  // Filter propertyData based on selected year
  const filteredData = propertyData.filter((income) => {
    const createdAtYear = new Date(income.createdAt).getFullYear();
    return !yearFilter || createdAtYear.toString() === yearFilter;
  });

  // Calculate the total amount for all users
  const totalAmountForAllUsers = filteredData.reduce((total, income) => {
    const totalAmount = Object.values(income.months || {}).reduce(
      (sum, amount) => sum + (Number(amount) || 0),
      0
    );
    return total + totalAmount;
  }, 0);

  if (loading) {
    return (
      <p className="text-center text-gray-500 text-lg font-semibold">
        Loading income information...
      </p>
    );
  }

  if (!propertyData || propertyData.length === 0) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        No income information found.
      </p>
    );
  }

  const handlePrint = () => {
    window.print();
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
                Owner Name
              </th>
              {Object.keys(filteredData[0]?.months || {}).map((month) => (
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
            </tr>
          </thead>
          <tbody>
            {filteredData.map((income) => {
              const totalAmount = Object.values(income.months || {}).reduce(
                (sum, amount) => sum + (Number(amount) || 0),
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
                  {Object.values(income.months || {}).map((amount, index) => (
                    <td
                      key={`${income._id}-${index}`}
                      className="px-4 py-2 text-gray-800"
                    >
                      {amount || 0}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-gray-800">{totalAmount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Display Total Amount for All Users */}
      <div className="mt-6 text-white text-center text-lg font-semibold">
        <p>Total Amount for All Users: {totalAmountForAllUsers}</p>
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

export default PrintIncome;
