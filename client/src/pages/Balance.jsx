import React, { useEffect, useState } from "react";
import {
  getAllIncomeApi,
  getAllOutcomeApi,
} from "../services/operation/function";
import { useNavigate, useParams } from "react-router-dom";

const Balance = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [outcomeData, setOutcomeData] = useState([]);
  const [filteredIncome, setFilteredIncome] = useState([]);
  const [filteredOutcome, setFilteredOutcome] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalOutcome, setTotalOutcome] = useState(0);
  const [balance, setBalance] = useState(0);
  const { id } = useParams();

  // Fetch income data
  const fetchIncome = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getAllIncomeApi(id);
      setIncomeData(data);
    } catch (error) {
      console.error("Error fetching income data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch outcome data
  const fetchOutcome = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getAllOutcomeApi(id);
      setOutcomeData(data);
    } catch (error) {
      console.error("Error fetching outcome data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter income and outcome by selected year
  useEffect(() => {
    if (selectedYear) {
      const filteredIncomeData = incomeData.filter(
        (income) =>
          new Date(income.createdAt).getFullYear().toString() === selectedYear
      );
      const filteredOutcomeData = outcomeData.filter(
        (outcome) =>
          new Date(outcome.createdAt).getFullYear().toString() === selectedYear
      );
      setFilteredIncome(filteredIncomeData);
      setFilteredOutcome(filteredOutcomeData);
    } else {
      setFilteredIncome(incomeData);
      setFilteredOutcome(outcomeData);
    }
  }, [selectedYear, incomeData, outcomeData]);

  // Calculate total income, total outcome, and balance
  useEffect(() => {
    const incomeTotal = filteredIncome.reduce(
      (acc, item) => acc + item.totalAmount,
      0
    );
    const outcomeTotal = filteredOutcome.reduce(
      (acc, item) => acc + parseFloat(item.amount),
      0
    );
    setTotalIncome(incomeTotal);
    setTotalOutcome(outcomeTotal);
    setBalance(incomeTotal - outcomeTotal);
  }, [filteredIncome, filteredOutcome]);

  // Fetch data on component mount and when ID changes
  useEffect(() => {
    fetchIncome();
    fetchOutcome();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6  min-h-screen">
      <div className="flex flex-wrap gap-3 justify-center md:justify-center mb-6">
        <button onClick={() => navigate("/")} className="button-85">
          Go to Home
        </button>

        <button onClick={() => window.print()} className="button-85">
          Print Outcome
        </button>
      </div>
      <h1 className="text-3xl text-center text-blue-600 font-semibold mb-4">
        Balance Overview
      </h1>
      <br />

      {/* Filter by Year */}
      <div className="mb-6 flex justify-center">
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
      <div className="overflow-x-auto">
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
              <td className="py-4 px-4 font-semibold text-lg">
                {balance.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Balance;
