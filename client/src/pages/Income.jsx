import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  handleCreateIncomeApi,
  deleteIncomeApi,
  getAllIncomeApi,
  getAllOwnerApi, // Import the API for fetching owner data
} from "../services/operation/function";
import GetIncome from "../components/GetIncome";
import ReguralReport from "../components/Report/RegiralReports";

const Income = () => {
  const [ownerName, setOwnerName] = useState("");
  const [owners, setOwners] = useState([]); // State to store fetched owner data
  const [contribution, setContribution] = useState(""); // State for contribution input
  const [showForm, setShowForm] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const incomePayload = {
      ownerName,
      contribution,
      categoryId: id, // Optional if linked with a category
    };

    const success = await handleCreateIncomeApi(incomePayload);

    if (success) {
      setOwnerName("");
      setContribution("");
      setShowForm(false);
      fetchIncome();
    }
  };

  const fetchIncome = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getAllIncomeApi(id);
      console.log(data);
      setIncomeData(data);
    } catch (error) {
      console.error("Error fetching income data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const data = await getAllOwnerApi(id); // Fetch owner data
      setOwners(data); // Store owner data in state
      console.log(data);
    } catch (error) {
      console.error("Error fetching owner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (incomeId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this income entry? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      const success = await deleteIncomeApi(incomeId);
      if (success) {
        fetchIncome();
      }
    }
  };

  useEffect(() => {
    fetchIncome();
    fetchOwners(); // Fetch owners on component mount
  }, [id]);

  return (
    <div className="p-6 min-h-screen">
      <div className="income-page flex flex-col items-center mb-6">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
          <button
            onClick={() => navigate(-1)}
            className="button-85"
          >
            Budget Menu
          </button>
          <button onClick={() => navigate("/")}
          style={{ right: "750px" }}
          className="button-85">
            Go to Home
          </button>
          {/* <button className="button-85" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Income"}
          </button> */}
          {/* <button onClick={() => window.print()} className="button-85">
            Print Income
          </button> */}
        </div>

        {showForm && (
          <div className="form bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-4xl">
            {/* Dropdown for owner selection */}
            <select
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            >
              <option value="">Select Owner</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.name}>
                  {owner.name}
                </option>
              ))}
            </select>

            {/* Contribution input */}
            <input
              type="number"
              placeholder="Enter Contribution Amount"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />

            <div className="flex justify-center items-center">
              <button onClick={handleSubmit} className="button-85">
                Create Income
              </button>
            </div>
          </div>
        )}
      </div>

      <GetIncome
        propertyData={incomeData}
        loading={loading}
        onDelete={handleDelete}
        id={id}
        fetchIncome={fetchIncome}
      />

    </div>
  );
};

export default Income;
