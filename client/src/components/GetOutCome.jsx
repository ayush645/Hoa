import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import {
  getAllOutcomeApi,
  updateMonthOutComeApi,
} from "../services/operation/function";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const GetOutCome = ({ propertyData, loading, onDelete, id,totalIncome,fetchIncomeMain ,fetchOutMain}) => {
  const [yearFilter, setYearFilter] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null);
  const [amount, setAmount] = useState("");
  const [incomeData, setIncomeData] = useState(propertyData);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [prev,setPre] = useState(0)

const [selectownerName, setSelectOwnerName] = useState("");

  const [totalContribution, setTotalContribution] = useState(  incomeData.reduce(
    (sum, income) => sum + (parseFloat(income.totalAmount) || 0),
    0
  ));


  useEffect(() => {
    setIncomeData(propertyData);
    const ammm =  incomeData.reduce(
      (sum, income) => sum + (parseFloat(income.totalAmount) || 0),
      0
    );
    setTotalContribution(ammm)
    console.log(totalIncome)
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
      setSelectOwnerName(selectedIncome.expense)
      console.log(selectedIncome.expense)
      setAmount(selectedIncome.months[month] || 0);
      console.log(selectedIncome.months[month])
      if(selectedIncome.months[month] > 0){
        setPre(selectedIncome.months[month])
      }
      setIsModalOpen(true);
    }
  };

  const fetchIncome = async () => {
    try {
      const data = await getAllOutcomeApi(id);
      setIncomeData(data);
      calculateTotalContribution()
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };



  const calculateTotalContribution = () => {
    const ammm =  incomeData.reduce(
      (sum, income) => sum + (parseFloat(income.totalAmount) || 0),
      0
    );
    setTotalContribution(ammm)
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
        parseFloat(amount),
        selectownerName
      );

      if (result) {
        toast.success("Month updated successfully");
        setSelectedMonth(null);
        setSelectedIncomeId(null);
        fetchIncome();
        fetchOutMain()
        calculateTotalContribution()
        setIsModalOpen(false);
        fetchIncomeMain()
        window.location.reload()
      }
    } catch (error) {
      toast.error("Error updating the month. Please try again.");
    }
  };
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


  const handleChange = (e) => {
    const value = e.target.value;
    console.log(prev < 0)
    
    if(prev != 0){
   
      console.log(selectedIncomeId)
      const setAmmout2 = (totalIncome + prev)  - totalContribution 
      console.log( value < 0)
      if (value < 0) {
        toast.error("Amount cannot be negative.", );
        setAmount("");
        return
      } else if (value > setAmmout2) {

        console.log(totalIncome)
        toast.error(`Amount cannot exceed total income (${setAmmout2}).`, );
        setAmount('');
        return
      } else {
        setAmount(value);
        return
      }
    }


else if(prev == 0){
  if (value < 0) {
    toast.error("Amount cannot be negative.", );
    setAmount("");
  } else if (value > (totalIncome - totalContribution)) {
    console.log(totalIncome - totalContribution)
    toast.error(`Amount cannot exceed total income (${totalIncome - totalContribution}).`, );
    setAmount('');
  } else {
    setAmount(value);
  }
}
  };


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
              <td className="px-4 py-2 text-gray-800">{totalContribution}</td>
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
        max={totalIncome}
        placeholder="Enter Amount"
        value={amount}
        onChange={handleChange}
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
      <div className="mt-8 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
  <h3 className="text-xl font-semibold mb-4">Total Contributions:</h3>
  <ul className="space-y-2">
    {Object.entries(monthlyTotals).map(([month, total]) => (
      <li key={month} className="text-gray-300">
        <span className="font-medium">{month}:</span> {total}
      </li>
    ))}
  </ul>
  <p className="text-lg font-bold text-white mt-4">
    Grand Total: <span className="text-yellow-400">{totalContribution}</span>
  </p>
</div>

    </div>
  );
};

export default GetOutCome;
