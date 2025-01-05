import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  handleCreateOutcomeAPi,
  deleteOutComeApi,
  getAllOutcomeApi,
} from "../services/operation/function";
import GetOwner from "../components/GetOwner";
import GetOutCome from "../components/GetOutCome";

const OutCome = () => {
  const [expense, setExpense] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams(); // Getting categoryId directly from the URL
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const propertyData = {
      expense,
      categoryId: id, // Using categoryId directly from the URL
    };

    const success = await handleCreateOutcomeAPi(propertyData);

    if (success) {
      setExpense("");
      setShowForm(false);
      fetchOutCome();
    }
  };

  const fetchOutCome = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getAllOutcomeApi(id);
      setPropertyData(data);
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
      const success = await deleteOutComeApi(propertyId);
      if (success) {
        fetchOutCome();
      }
    }
  };

  useEffect(() => {
    fetchOutCome();
  }, [id]); // Re-fetch outcomes whenever the category ID changes

  return (
    <div className="p-6 min-h-screen">
      <div className="property-page flex flex-col items-center mb-6">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
          <button onClick={() => navigate("/")} className="button-85">
            Go to Home
          </button>
          <button className="button-85" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Outcome"}
          </button>
          <button onClick={() => window.print()} className="button-85">
            Print Outcome
          </button>
        </div>

        {showForm && (
          <div className="form bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-4xl">
            <input
              type="text"
              placeholder="Enter Expenses "
              value={expense}
              onChange={(e) => setExpense(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />

            <div className="flex justify-center items-center">
              <button onClick={handleSubmit} className="button-85">
                Create Outcome
              </button>
            </div>
          </div>
        )}
      </div>

      <GetOutCome
        propertyData={propertyData}
        loading={loading}
        onDelete={handleDelete}
        id={id}
      />
    </div>
  );
};

export default OutCome;
