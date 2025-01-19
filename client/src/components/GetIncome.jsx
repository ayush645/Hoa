import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import {
  getAllIncomeApi,
  updateMonthIncomeApi,
} from "../services/operation/function";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import NotifationsSender from "./Report/NotifationsSender";
import ReguralReport from "./Report/RegiralReports";

const GetIncome = ({ propertyData, loading, onDelete, id }) => {
  const [yearFilter, setYearFilter] = useState(""); // State to store selected year
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null); // New state to store selected income ID
  const [paymentStatus, setPaymentStatus] = useState("Not Paid");
  const [partialAmount, setPartialAmount] = useState(0);
  const [incomeData, setIncomeData] = useState(propertyData); // Added state to store fetched income data
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [selectedIncomeData, setSelectedIncomeData] = useState(null); // Store selected income data for the modal
  const [paymentType, setPaymentType] = useState("Cash");

  const [SelectownerName, setSelectOwnerName] = useState("");


  const [mainData,setmainData] = useState([])



   const fetchIncome2 = async () => {
      if (!id) return;
  
      try {
     
        const data = await getAllIncomeApi(id);
        setmainData(data)
     
      } catch (error) {
        console.error("Error fetching income data:", error);
      } finally {
      
      }
    };


  useEffect(() => {
    setIncomeData(propertyData);
    fetchIncome2()
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
      console.log(selectedIncome?.ownerName);
      setSelectOwnerName(selectedIncome.ownerName);
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
        amountToUpdate,
        SelectownerName,
        yearFilter,
        paymentType
      );

      if (result) {
        toast.success("Month updated successfully"); // Success toast
        setSelectedMonth(null);
        setSelectedIncomeId(null); // Clear selectedIncomeId
        fetchIncome(); // Re-fetch income data after the update
        fetchIncome2()
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

  const currentMonthIndex = new Date().getMonth(); // Current month ka index (0 - January, 11 - December)

  const totalDeficit = months
    .filter((month) => {
      const monthIndex = new Date(`1 ${month} 2000`).getMonth(); // Month string se index nikalna
      return monthIndex <= currentMonthIndex; // Sirf current aur purane months ko include kare
    })
    .reduce((total, month) => total + (monthlyDeficits[month] || 0), 0);

  const totalIncome = months.reduce(
    (total, month) => total + (monthlyTotals[month] || 0),
    0
  );

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);

    if (value > totalContribution) {
      toast.error(`Value cannot exceed ${totalContribution}`);
      return;
    }

    if (isNaN(value) || value < 0) {
      setPartialAmount("");
    } else {
      setPartialAmount(value);
    }
  };

  const handleDownload = async (d1month) => {
    const categoryId = id; // Replace with actual category ID
    const month = d1month; // Replace with the selected month
    // Replace with the selected year

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/print/generate-pdf?categoryId=${categoryId}&month=${month}`
      );
      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();

        // Create an anchor element and trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `payment_details_${month}.pdf`;
        link.click();
      } else {
        alert("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error downloading PDF");
    }
  };

  const handleDownloadOwner = async (owId) => {
    const categoryId = id; // Replace with actual category ID
    const ownerId = owId;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/print/generate-pdf-owner?categoryId=${categoryId}&ownerId=${ownerId}`
      );
      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();

        // Create an anchor element and trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `payment_details.pdf`;
        link.click();
      } else {
        alert("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error downloading PDF");
    }
  };

  // Export as PDF
  const handlePrintPDF = () => {
    const doc = new jsPDF();
    const tableColumns = ["Owner Name", "Contribution", ...months, "Total"];
    const tableRows = [];

    filteredData.forEach((income) => {
      const totalAmount = Object.values(income.months).reduce(
        (sum, value) => sum + value,
        0
      );
      const row = [
        income.ownerName,
        income.contribution,
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
        const totalAmount = Object.values(income.months).reduce(
          (sum, value) => sum + value,
          0
        );
        return {
          "Owner Name": income.ownerName,
          Contribution: income.contribution,
          ...months.reduce(
            (acc, month) => ({ ...acc, [month]: income.months[month] || 0 }),
            {}
          ),
          Total: totalAmount,
        };
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Income Data");
    XLSX.writeFile(wb, "income-information.xlsx");
  };

  const handleDownloadYearl = async () => {
    const categoryId = id; // Replace with actual category ID

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/print/generate-pdfYear?categoryId=${categoryId}`
      );
      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();

        // Create an anchor element and trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `YearlReport.pdf`;
        link.click();
      } else {
        alert("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error downloading PDF");
    }
  };

  return (
    <div className="income-info-container p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Income Information
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
      {!yearFilter && (
        <div className="flex justify-center items-center mt-5">
          <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-lg shadow-lg max-w-md text-center">
            <p className="font-semibold text-lg">Please select a year.</p>
          </div>
        </div>
      )}
      {yearFilter && (
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
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  Deficit
                </th>
                <th className="px-4 py-2 text-center text-gray-600 font-semibold">
                  Actions
                </th>
                <th className="px-4 py-2 text-center text-gray-600 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((income) => {
                const totalAmount = Object.values(income.months).reduce(
                  (sum, value) => sum + value,
                  0
                );

                const currentMonthIndex = new Date().getMonth(); // Get current month index (0-based)
                const monthsUpToCurrent = months.filter(
                  (_, index) => index <= currentMonthIndex
                ); // Filter months up to the current one

                const paidUpToCurrent = monthsUpToCurrent.reduce(
                  (sum, month) => {
                    return sum + (income.months[month] || 0);
                  },
                  0
                ); // Sum of amounts paid up to the current month

                const deficit = income.contribution - paidUpToCurrent; // Calculate deficit

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

                      // Convert the month to a Date object (assuming the month string is in a format like "January", "February", etc.)
                      const monthIndex = new Date(
                        `${month} 1, 2025`
                      ).getMonth(); // Set a fixed year to avoid errors
                      const currentMonthIndex = new Date().getMonth(); // Current month index

                      // Determine the background color based on conditions
                      const bgColor =
                        income.statuses[month] === "not paid" &&
                        monthAmount === 0
                          ? "bg-red-500 text-white"
                          : monthAmount === 0 &&
                            income.statuses !== "not updated"
                          ? "bg-white text-gray-800"
                          : monthIndex > currentMonthIndex && monthAmount > 0
                          ? "bg-yellow-400 text-black"
                          : monthAmount === income.contribution
                          ? "bg-green-500 text-white"
                          : monthAmount < income.contribution
                          ? "bg-orange-500 text-white"
                          : "";

                      return (
                        <td
                          key={month}
                          className={`px-4 py-2 ${bgColor} cursor-pointer border`}
                          onClick={() => handleMonthClick(income._id, month)}
                        >
                          {monthAmount > 0 && monthIndex > currentMonthIndex ? (
                            <span className="flex flex-col">
                              {monthAmount} Advance
                            </span>
                          ) : monthAmount === 0 ? (
                            <span>0</span>
                          ) : monthAmount !== income.contribution ? (
                            monthAmount - income.contribution
                          ) : (
                            monthAmount
                          )}
                        </td>
                      );
                    })}

                    <td className="px-4 py-2 text-gray-800">{totalAmount}</td>
                    <td className="px-4 py-2 bg-red-600">
                      {deficit === 0 ? "0" : `-${deficit}`}
                    </td>

                    <td className="px-4 py-2 text-center">
                      <FaTrash
                        className="text-red-500 cursor-pointer"
                        onClick={() => onDelete(income._id)}
                      />
                    </td>
                    <td
                      className="px-4 py-2 text-blue-800 underline"
                      onClick={() => handleDownloadOwner(income._id)}
                    >
                      Owner report
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
                {/* //null */}
                <td className="px-4 py-2 text-gray-800">{totalIncome}</td>
                <td className="px-4 py-2 text-center"></td>
              </tr>

              {/* Footer Row for Deficit */}
              <tr className="bg-gray-100 font-bold">
                <td className="px-4 py-2 text-gray-800">Deficit</td>
                <td className="px-4 py-2 text-gray-800">-</td>
                {months.map((month) => {
                  const currentMonthIndex = new Date().getMonth(); // Current month ka index (0 - January, 11 - December)
                  const monthIndex = new Date(`1 ${month} 2000`).getMonth(); // Month string se index nikalna

                  return (
                    <td key={month} className="px-4 py-2 text-gray-800">
                      {monthIndex <= currentMonthIndex
                        ? monthlyDeficits[month] || 0 // Current aur purane months ka data
                        : "Not Happened"}
                    </td>
                  );
                })}

                {/* null */}
                <td className="px-4 py-2 text-red-800">-{totalDeficit}</td>
                <td className="px-4 py-2 text-center"></td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                {months.map((month) => (
                  <td
                    key={month}
                    onClick={() => handleDownload(month)}
                    className="px-4 py-2 text-left text-blue-600 underline cursor-pointer "
                  >
                    {month} Report
                  </td>
                ))}
                <td
                  className="px-4 py-2 text-left text-blue-600 underline cursor-pointer "
                  onClick={handleDownloadYearl}
                >
                  {" "}
                  Yearl Report
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {yearFilter && <ReguralReport type="income" mainData={mainData} />}
   
   
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ">
          <div className="bg-white max-h-[95vh] overflow-y-auto rounded-lg shadow-lg p-8 w-full max-w-md space-y-6">
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
                Contribution:{" "}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                >
                  {/* Dynamically Render Options */}
                  {(() => {
                    const currentMonthIndex = new Date().getMonth(); // Current month index
                    const selectedMonthIndex = new Date(
                      `${selectedMonth} 1, ${yearFilter}`
                    ).getMonth(); // Selected month index

                    if (selectedMonthIndex > currentMonthIndex) {
                      // Future month: Show only "Pay In Advance"
                      return (
                        <option value="Pay In Advance">Pay In Advance</option>
                      );
                    } else {
                      // Current or past month: Show all options except "Pay In Advance"
                      return (
                        <>
                          <option value="Not Paid">Not Paid</option>
                          <option value="Full Paid">Full Paid</option>
                          <option value="Partially Paid">Partially Paid</option>
                        </>
                      );
                    }
                  })()}
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
                    onChange={handleChange}
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
            {(() => {
              const currentMonthIndex = new Date().getMonth(); // Current month index
              const selectedMonthIndex = new Date(
                `${selectedMonth} 1, ${yearFilter}`
              ).getMonth(); // Selected month index

              // Only render NotifationsSender for current or past months
              if (selectedMonthIndex <= currentMonthIndex) {
                return (
                  <NotifationsSender
                    ownerId={selectedIncomeId}
                    dueMonth={selectedMonth}
                  />
                );
              }
              return null; // Do not render anything for future months
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetIncome;
