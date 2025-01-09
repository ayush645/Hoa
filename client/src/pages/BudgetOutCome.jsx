import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createBudgetOutcomeAPi,
  deleteBudgetOutComeApi,
  getAllBudgetIncomeApi,
  getAllBudgetOutcomeApi,
} from "../services/operation/function";
import GetBudgetOutCome from "../components/GetBudgetOutCome";
import ImageUploaderWithCrop from "../components/common/ImageUpload";
import ExpeptionalReports from "../components/Report/ExpeptionalReports";

const BudgetOutCome = () => {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmountOut, setTotalAmountOut] = useState(0);
  const [totalAmountincome, setTotalAmountIncome] = useState(0);
 const [imageData, setImageData] = useState({ publicId: "", url: "" }); // State to store only public_id and url
  const [selectedImage, setSelectedImage] = useState(null); // Base64 image data

  const { id } = useParams(); // Getting categoryId directly from the URL
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const propertyData = {
      type,
      amount,
      categoryId: id, // Using categoryId directly from the URL
      document:imageData
    };
    const availableBalance = totalAmountincome - totalAmountOut;

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

    const success = await createBudgetOutcomeAPi(propertyData);

    if (success) {
      setType("");
      setAmount("");
      setShowForm(false);
      fetchOutCome();
    }
  };

  const fetchOutCome = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getAllBudgetOutcomeApi(id);
      if (data) {
        const total = data.reduce(
          (sum, property) => sum + (parseInt(property.amount) || 0), // Convert amount to an integer
          0
        );
        setTotalAmountOut(total);

        setPropertyData(data);
      }
    } catch (error) {
      console.error("Error fetching property information:", error);
    } finally {
      setLoading(false);
    }
  };

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
  const handleDelete = async (propertyId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this outcome? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      const success = await deleteBudgetOutComeApi(propertyId);
      if (success) {
        fetchOutCome();
      }
    }
  };

  useEffect(() => {
    fetchOutCome();
    fetchBudgetIncome();
  }, [id]); // Re-fetch outcomes whenever the category ID changes

  return (
    <div className="p-6 min-h-screen">
      <div className="property-page flex flex-col items-center mb-6">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
          <button onClick={() => navigate("/")} className="button-85">
            Go to Home
          </button>
          <button className="button-85" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Budget Outcome"}
          </button>
          <button onClick={() => window.print()} className="button-85">
            Print Budget Outcome
          </button>
        </div>

        {showForm && (
          <div className="form bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-4xl">
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

            <div className="flex justify-center items-center">
              <button onClick={handleSubmit} className="button-85">
                Create Budget Outcome
              </button>
            </div>
          </div>
        )}
      </div>

      <GetBudgetOutCome
        propertyData={propertyData}
        loading={loading}
        onDelete={handleDelete}
      />

      <ExpeptionalReports type={'outcome'} />
    </div>
  );
};

export default BudgetOutCome;
