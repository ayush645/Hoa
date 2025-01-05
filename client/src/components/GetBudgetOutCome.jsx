import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa"; // Import Trash Icon

const GetBudgetOutCome = ({ propertyData, loading, onDelete }) => {
  const [filteredData, setFilteredData] = useState(propertyData);
  const [selectedYear, setSelectedYear] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Calculate the total amount by summing individual property amounts
    const total = filteredData.reduce(
      (sum, property) => sum + (parseInt(property.amount) || 0), // Convert amount to an integer
      0
    );
    setTotalAmount(total);
  }, [filteredData]);

  useEffect(() => {
    // Filter data by year
    if (selectedYear) {
      const filtered = propertyData.filter(
        (property) =>
          new Date(property.createdAt).getFullYear().toString() === selectedYear
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(propertyData);
    }
  }, [selectedYear, propertyData]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 text-lg font-semibold">
        Loading property information...
      </p>
    );
  }

  if (!propertyData || propertyData.length === 0) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        No property information found.
      </p>
    );
  }

  return (
    <div className="property-info-container p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Property Information
      </h2>

      {/* Filter for Year */}
      <div className="mb-4 flex justify-center">
        <label htmlFor="year" className="mr-2 text-white mt-2">
          Filter by Year:
        </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">All</option>
          {propertyData
            .map((property) => new Date(property.createdAt).getFullYear())
            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
            .map((year) => (
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
                Code
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Expense Type
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Value of Expense
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Date & Time
              </th>
              <th className="px-4 py-2 text-center text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((property, index) => (
              <tr
                key={property._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2 text-gray-800">{index + 1}</td>
                <td className="px-4 py-2 text-gray-800">
                  {property?.type || "N/A"}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  ₹{property?.amount || "N/A"}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {new Date(property?.createdAt).toLocaleDateString()}{" "}
                  {new Date(property?.createdAt).toLocaleTimeString()}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onDelete(property._id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none"
                    title="Delete Property"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Amount */}
      <div className="mt-4 text-white text-center font-semibold">
        <p>Total Amount: ₹{totalAmount}</p>
      </div>
    </div>
  );
};

export default GetBudgetOutCome;
