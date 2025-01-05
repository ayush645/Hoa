import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  handleCreateUnitsAPi,
  getAllUnitsApi,
  deleteUnitsApi,
} from "../services/operation/function";
import GetUnits from "../components/GetUnits";

const Units = () => {
  const [type, setType] = useState("");
  const [fee, setFee] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const propertyData = {
      type,
      fee,
      categoryId: id,
    };

    const success = await handleCreateUnitsAPi(propertyData);

    if (success) {
      setType("");
      setFee("");

      setShowForm(false);
      fetchUnits();
    }
  };

  const fetchUnits = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getAllUnitsApi(id);
      setPropertyData(data);
    } catch (error) {
      console.error("Error fetching property information:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Property
  const handleDelete = async (propertyId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this property? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      const success = await deleteUnitsApi(propertyId);
      if (success) {
        fetchUnits();
      }
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [id]);

  return (
    <div className="p-6 min-h-screen">
      <div className="property-page flex flex-col items-center mb-6">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
          <button onClick={() => navigate("/")} className="button-85">
            Go to Home
          </button>
          <button className="button-85" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Property Information"}
          </button>
          <button onClick={() => window.print()} className="button-85">
            Print Property
          </button>
        </div>

        {showForm && (
          <div className="form bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-4xl">
            <input
              type="text"
              placeholder="Enter Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />
            <input
              type="text"
              placeholder="Enter Regular Monthly fees"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />

            <div className="flex justify-center items-center">
              <button onClick={handleSubmit} className="button-85">
                Create Units
              </button>
            </div>
          </div>
        )}
      </div>

      <GetUnits
        propertyData={propertyData}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Units;
