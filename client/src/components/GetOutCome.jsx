import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import {
  getAllOutcomeApi,
  updateMonthOutComeApi,
} from "../services/operation/function";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";


const GetOutCome = ({
  propertyData,
  loading,
  onDelete,
  id,
  totalIncome,
  fetchIncomeMain,
  fetchOutMain,
}) => {
  const [yearFilter, setYearFilter] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null);
  const [amount, setAmount] = useState("");
  const [incomeData, setIncomeData] = useState(propertyData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prev, setPre] = useState(0);

  const [selectownerName, setSelectOwnerName] = useState("");

  const [totalContribution, setTotalContribution] = useState(
    incomeData.reduce(
      (sum, income) => sum + (parseFloat(income.totalAmount) || 0),
      0
    )
  );

  useEffect(() => {
    setIncomeData(propertyData);
    const ammm = incomeData.reduce(
      (sum, income) => sum + (parseFloat(income.totalAmount) || 0),
      0
    );
    setTotalContribution(ammm);
    console.log(totalIncome);
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
    const monthMap = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const numericMonth = monthMap[month];
    if (numericMonth === undefined) {
      alert("Invalid month selected.");
      return;
    }

    const currentMonth = new Date().getMonth();
    console.log("Current Month (0-11):", currentMonth);
    console.log("Selected Month (0-11):", numericMonth);

    if (numericMonth > currentMonth) {
      Swal.fire({
        icon: "error",
        title: "Invalid Selection",
        text: "The selected month cannot be greater than the current month.",
        confirmButtonText: "OK",
      });
      return;
    }

    setSelectedIncomeId(incomeId);
    setSelectedMonth(month);
    console.log(month);
    const selectedIncome = filteredData.find(
      (income) => income._id === incomeId
    );
    if (selectedIncome) {
      setSelectOwnerName(selectedIncome.expense);
      console.log(selectedIncome.expense);
      setAmount(selectedIncome.months[month] || 0);
      console.log(selectedIncome.months[month]);
      if (selectedIncome.months[month] > 0) {
        setPre(selectedIncome.months[month]);
      }
      setIsModalOpen(true);
    }
  };

  const fetchIncome = async () => {
    try {
      const data = await getAllOutcomeApi(id);
      setIncomeData(data);
      calculateTotalContribution();
    } catch (error) {
      console.error("Error fetching income data:", error);
    }
  };

  const calculateTotalContribution = () => {
    const ammm = incomeData.reduce(
      (sum, income) => sum + (parseFloat(income.totalAmount) || 0),
      0
    );
    setTotalContribution(ammm);
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
        selectownerName,
        yearFilter
      );

      if (result) {
        toast.success("Month updated successfully");
        setSelectedMonth(null);
        setSelectedIncomeId(null);
        fetchIncome();
        fetchOutMain();
        calculateTotalContribution();
        setIsModalOpen(false);
        fetchIncomeMain();
        window.location.reload();
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
    console.log(prev < 0);

    if (prev != 0) {
      console.log(selectedIncomeId);
      const setAmmout2 = totalIncome + prev - totalContribution;
      console.log(value < 0);
      if (value < 0) {
        toast.error("Amount cannot be negative.");
        setAmount("");
        return;
      } else if (value > setAmmout2) {
        console.log(totalIncome);
        toast.error(`Amount cannot exceed total income (${setAmmout2}).`);
        setAmount("");
        return;
      } else {
        setAmount(value);
        return;
      }
    } else if (prev == 0) {
      if (value < 0) {
        toast.error("Amount cannot be negative.");
        setAmount("");
      } else if (value > totalIncome - totalContribution) {
        console.log(totalIncome - totalContribution);
        toast.error(
          `Amount cannot exceed total income (${
            totalIncome - totalContribution
          }).`
        );
        setAmount("");
      } else {
        setAmount(value);
      }
    }
  };
    // Export as PDF
    const handlePrintPDF = () => {
      const doc = new jsPDF();
      const tableColumns = ["Expense", ...months, "Total"];
      const tableRows = [];
  
      filteredData.forEach((income) => {
        const totalAmount = Object.values(income.months).reduce((sum, value) => sum + value, 0);
        const row = [
          income.expense,
  
          ...months.map((month) => income.months[month] || 0),
          totalAmount,
        ];
        tableRows.push(row);
      });
  
      doc.text("Income Information", 14, 10);
      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 20,
      });
      doc.save("income-information.pdf");
    };
  
    // Export as Excel
    const handleExportExcel = () => {
      const ws = XLSX.utils.json_to_sheet(
        filteredData.map((income) => {
          const totalAmount = Object.values(income.months).reduce((sum, value) => sum + value, 0);
          return {
            "Expense": income.expense,
              ...months.reduce((acc, month) => ({ ...acc, [month]: income.months[month] || 0 }), {}),
            Total: totalAmount,
          };
        })
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Income Data");
      XLSX.writeFile(wb, "income-information.xlsx");
    };

  return (
    <div className="income-info-container p-6 max-h-[80vh]">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        OutCome Information
      </h2>
      <div className=" w-full flex justify-center mb-4">
        <button
          onClick={handlePrintPDF}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        >
          Print as PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Export to Excel
        </button>
      </div>
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

      {!yearFilter && (
    <div className="flex justify-center items-center mt-5">
      <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-lg shadow-lg max-w-md text-center">
        <p className="font-semibold text-lg">Please select a year.</p>
      </div>
    </div>
  )}


   {
    yearFilter &&  <div className="overflow-x-auto">
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
   }

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
    </div>
  );
};

export default GetOutCome;
