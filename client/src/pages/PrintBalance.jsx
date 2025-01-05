import React, { useEffect, useState } from "react";
import { getIncomeApi, getOutcomeApi } from "../services/operation/function";
import { useNavigate, useParams } from "react-router-dom";

const PrintBalance = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [outcomeData, setOutcomeData] = useState([]);
  const [filteredIncome, setFilteredIncome] = useState([]);
  const [filteredOutcome, setFilteredOutcome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalOutcome, setTotalOutcome] = useState(0);
  const [balance, setBalance] = useState(0);
  const { id } = useParams();

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [incomeResponse, outcomeResponse] = await Promise.all([
        getIncomeApi(id),
        getOutcomeApi(id),
      ]);
      setIncomeData(incomeResponse);
      setOutcomeData(outcomeResponse);
    } catch (err) {
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter data by selected year
  useEffect(() => {
    const filterData = () => {
      if (selectedYear) {
        setFilteredIncome(
          incomeData.filter(
            (item) =>
              new Date(item.createdAt).getFullYear().toString() === selectedYear
          )
        );
        setFilteredOutcome(
          outcomeData.filter(
            (item) =>
              new Date(item.createdAt).getFullYear().toString() === selectedYear
          )
        );
      } else {
        setFilteredIncome(incomeData);
        setFilteredOutcome(outcomeData);
      }
    };
    filterData();
  }, [selectedYear, incomeData, outcomeData]);

  // Calculate totals and balance
  useEffect(() => {
    const calculateTotals = () => {
      const incomeTotal = filteredIncome.reduce(
        (acc, item) => acc + (item.totalAmount || 0),
        0
      );
      const outcomeTotal = filteredOutcome.reduce(
        (acc, item) => acc + parseFloat(item.amount || 0),
        0
      );
      setTotalIncome(incomeTotal);
      setTotalOutcome(outcomeTotal);
      setBalance(incomeTotal - outcomeTotal);
    };
    calculateTotals();
  }, [filteredIncome, filteredOutcome]);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl text-center text-blue-600 font-semibold mb-4">
        Balance Overview
      </h1>

      {/* Year Filter */}
      <div className="mb-6 flex justify-center">
        <label htmlFor="year" className="mr-2 text-gray-700 mt-2">
          Filter by Year:
        </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">All</option>
          {[
            ...new Set(
              [...incomeData, ...outcomeData].map((item) =>
                new Date(item.createdAt).getFullYear()
              )
            ),
          ]
            .sort()
            .reverse()
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
      </div>

      {/* Balance Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-center text-lg">TOTAL INCOME</th>
              <th className="py-3 px-4 text-center text-lg">TOTAL OUTCOME</th>
              <th className="py-3 px-4 text-center text-lg">BALANCE</th>
            </tr>
          </thead>
          <tbody className="text-center">
            <tr>
              <td className="py-4 px-4">{totalIncome.toFixed(2)}</td>
              <td className="py-4 px-4">{totalOutcome.toFixed(2)}</td>
              <td
                className={`py-4 px-4 font-semibold text-lg ${
                  balance < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {balance.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Print Button */}
      <div className="flex justify-center">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default PrintBalance;
