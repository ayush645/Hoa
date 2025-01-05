import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  handleCreateOwnerAPi,
  deleteOwnerApi,
  getAllOwnerApi,
} from "../services/operation/function";
import GetOwner from "../components/GetOwner";

const Owner = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [unit, setUnit] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const propertyData = {
      name,
      address,
      phone,
      email,
      unit,

      categoryId: id,
    };

    const success = await handleCreateOwnerAPi(propertyData);

    if (success) {
      setName("");
      setAddress("");
      setPhone("");
      setEmail("");
      setUnit("");

      setShowForm(false);
      fetchOwner();
    }
  };

  const fetchOwner = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getAllOwnerApi(id);
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
      text: "Do you want to delete this property? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      const success = await deleteOwnerApi(propertyId);
      if (success) {
        fetchOwner();
      }
    }
  };

  useEffect(() => {
    fetchOwner();
  }, [id]);

  return (
    <div className="p-6 min-h-screen">
      <div className="property-page flex flex-col items-center mb-6">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
          <button onClick={() => navigate("/")} className="button-85">
            Go to Home
          </button>
          <button className="button-85" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add Property Owner"}
          </button>
          <button onClick={() => window.print()} className="button-85">
            Print Property
          </button>
        </div>

        {showForm && (
          <div className="form bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-4xl">
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />
            <input
              type="text"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />
            <input
              type="text"
              placeholder="Enter Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />
            <input
              type="text"
              placeholder="Enter Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />

            <div className="flex justify-center items-center">
              <button onClick={handleSubmit} className="button-85">
                Create Owner
              </button>
            </div>
          </div>
        )}
      </div>

      <GetOwner
        propertyData={propertyData}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Owner;
