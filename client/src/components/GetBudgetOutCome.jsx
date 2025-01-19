import React, { useState, useEffect } from "react";
import { FaTrash ,FaEdit} from "react-icons/fa"; // Import Trash Icon
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import ImageUploaderWithCrop from "./common/ImageUpload";
import { getAllBudgetIncomeApi, updateBudgetOutcomeAPI } from "../services/operation/function";
import Swal from "sweetalert2";
import ExpeptionalReports from "./Report/ExpeptionalReports";

const GetBudgetOutCome = ({ propertyData, loading, onDelete ,setLoading,fetchOutCome,id}) => {
  const [filteredData, setFilteredData] = useState(propertyData);
  const [selectedYear, setSelectedYear] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);


    const [type, setType] = useState("");
    const [amount, setAmount] = useState("");
    const [showForm, setShowForm] = useState(false);
     const [totalAmountOut, setTotalAmountOut] = useState(0);
    const [totalAmountincome, setTotalAmountIncome] = useState(0);
   const [imageData, setImageData] = useState({ publicId: "", url: "" }); // State to store only public_id and url
    const [selectedImage, setSelectedImage] = useState(null); // Base64 image data
    const[change,setChange] = useState(0)

  const [seletedId, setSeletedId] = useState(null);


  const fetchBudgetIncome = async () => {
      if (!id) return;
  
      try {
        setLoading(true);
        const data = await getAllBudgetIncomeApi(id);
        if (data) {
          const total = data.reduce(
            (sum, property) => sum + (parseInt(property.amount) || 0), // Convert amount to an integer
            0
          );
          setTotalAmountIncome(total);
  
          console.log(total);
        }
      } catch (error) {
        console.error("Error fetching property information:", error);
      } finally {
        setLoading(false);
      }
    };

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

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    const tableColumns = ["Expense Type", "Value of Expense", , "Date Time"];
    const tableRows = [];

    filteredData.forEach((income) => {
      const row = [
        income.type,
        income.amount,
        `${new Date(income?.createdAt).toLocaleDateString()} ${new Date(
          income?.createdAt
        ).toLocaleTimeString()}`,
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

    const handleSubmit = async () => {
      const propertyData = {
        type,
        amount,
       
        document:imageData
      };
      const availableBalance = totalAmountincome - totalAmountOut;
  console.log(imageData)
      
      if (amount > totalAmountincome - totalAmountOut) {
        Swal.fire({
          title: "Error!",
          text: `The amount exceeds the available balance of ${availableBalance.toFixed(
            2
          )}.`,
          icon: "error",
          confirmButtonText: "Ok",
        });
  
        return false; // Don't allow the amount
      }
  
      const success = await updateBudgetOutcomeAPI(propertyData,seletedId);
  
      if (success) {
        setType("");
        setAmount("");
        setShowForm(false);
        fetchOutCome();
        setChange(change + 1)
      }
    };

  // Export as Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((income) => {
        return {
          "Expense Type": income.type,
          "Value of Expense	": income.amount,
          "Date&Time": `${new Date(
            income?.createdAt
          ).toLocaleDateString()} ${new Date(
            income?.createdAt
          ).toLocaleTimeString()}`,
        };
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Income Data");
    XLSX.writeFile(wb, "income-information.xlsx");
  };

  const toggleForm = () => setShowForm(!showForm);


  useEffect(()=>{
    fetchBudgetIncome()
  },[])

  const editHandle = async (id) => {
    setSeletedId(id);
    console.log(id);

    // Filter the propertyData to find the matching item
    const selectedData = propertyData.find((item) => item._id === id);
    console.log(selectedData);
    if (selectedData) {
      // Set the form fields with the data from the selected item
      setType(selectedData.type);
      setAmount(selectedData.amount);
      setImageData(selectedData.document || null); // If there's a base64 image, set it
      setShowForm(true); // Show the form modal
    } else {
      console.log("Item not found!");
    }
  };

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
    <div className="property-info-container p-6  max-h-[80vh]   ">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Property Information
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


{
  selectedYear && <div>
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
                  {property?.amount || "N/A"}
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
                  <button
                    onClick={() => editHandle(property._id)}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none"
                    title="Delete Property"
                  >
                    <FaEdit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
 {/* Total Amount */}
      <div className="mt-4 text-white text-center font-semibold">
        <p>Total Amount: {totalAmount}</p>
      </div>

<ExpeptionalReports type={'outcome'} change={change} />

</div>
}
     

     



      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="form bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-4xl relative">
            <button
              onClick={toggleForm}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
            >
              X
            </button>

            <h2 className="text-2xl font-semibold mb-4">Create Budget Outcome</h2>
            <input
              type="text"
              placeholder="Enter Expense Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />
            <input
              type="number"
              placeholder="Enter Value of Expense"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />
            <ImageUploaderWithCrop
              setImageData={setImageData}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              title="Upload Document"
            />
            <div className="flex justify-center items-center mt-4">
              <button onClick={handleSubmit} className="button-85">
                Create Budget Outcome
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetBudgetOutCome;
