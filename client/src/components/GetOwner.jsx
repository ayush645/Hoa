import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import Trash Icon
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  getAllUnitsApi,
  handleCreateOwnerAPi,
  handleUpdateOwnerAPi,
} from "../services/operation/function";
import { GrDuplicate } from "react-icons/gr";

const GetOwner = ({
  propertyData,
  loading,
  onDelete,
  fetchOwner,
  id,
  setLoading,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [unit, setUnit] = useState({ type: "", currency: "", fee: "" }); // Initialize as an object
  const [ownershipTitle, setOwnershipTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [unitsData, setUnitsData] = useState([]);
  const [selectId, setSelectId] = useState("");
  const [paymentType, setPaymentType] = useState("");

  const handleSubmit = async () => {
    const propertyData = {
      name,
      address,
      phone,
      email,
      unit,
      paymentType
    };
  

    const success = await handleUpdateOwnerAPi(propertyData, selectId);
console.log(success)
    if (success) {
      setName("");
      setAddress("");
      setPhone("");
      setEmail("");
      setUnit("");
      setPaymentType("");
   

      fetchOwner();
      setShowForm(false);
    }
  };
  const handleUnitChange = (e) => {
    const selectedUnit = unitsData.find(
      (unitData) => unitData.type === e.target.value
    );
    if (selectedUnit) {
      setUnit({
        type: selectedUnit.type,
        currency: selectedUnit.currency,
        fee: selectedUnit.fee,
      });
    } else {
      setUnit({ type: "", currency: "", fee: "" });
    }
  };

  const fetchUnits = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getAllUnitsApi(id);
      console.log(data);
      setUnitsData(data);
    } catch (error) {
      console.error("Error fetching property information:", error);
    } finally {
      setLoading(false);
    }
  };

  const editHandle = async (id) => {
    setSelectId(id); // Set the selected ID
    console.log(id);

    // Find the selected item based on the ID
    const selectedData = propertyData.find((item) => item._id === id);
    console.log(selectedData);

    if (selectedData) {
      // Populate the state variables with the selected item's data
      setName(selectedData.name || ""); // Set name
      setAddress(selectedData.address || ""); // Set address
      setPhone(selectedData.phone || ""); // Set phone
      setEmail(selectedData.email || ""); // Set email
      setPaymentType(selectedData.paymentType || ""); // Set email
      setUnit({
        type: selectedData.unitDetails?.type || "",
        currency: selectedData.unitDetails?.currency || "",
        fee: selectedData.unitDetails?.fee || "",
      }); // Set unit
      setOwnershipTitle(selectedData.ownershipTitle || ""); // Set ownership title

      setShowForm(true); // Show the form modal
    } else {
      console.log("Item not found!");
    }
  };


  const DuplicateHandle = async (id) => {
    setSelectId(id); // Set the selected ID
    console.log(id);

    // Find the selected item based on the ID
    const selectedData = propertyData.find((item) => item._id === id);
    console.log(selectedData);

    if (selectedData) {
      // Populate the state variables with the selected item's data
      setName(selectedData.name || ""); // Set name
      setAddress(selectedData.address || ""); // Set address
      setPhone(selectedData.phone || ""); // Set phone
      setEmail(selectedData.email || ""); // Set email
      setUnit({
        type: selectedData.unitDetails?.type || "",
        currency: selectedData.unitDetails?.currency || "",
        fee: selectedData.unitDetails?.fee || "",
      }); // Set unit
      setOwnershipTitle(selectedData.ownershipTitle || ""); // Set ownership title
      setPaymentType(selectedData.paymentType || ""); // Set email

       const propertyData = {
            name:selectedData.name,
            address:selectedData.address,
            phone:selectedData.phone,
            email:selectedData.email,
            unit:selectedData.unitDetails,
            paymentType: selectedData.paymentType,
      
            categoryId: selectedData.categoryId,
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
    } else {
      console.log("Item not found!");
    }
  };
  useState(() => {
    fetchUnits();
  }, []);
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
    <div className="property-info-container p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Owners
      </h2>

      <div className="overflow-x-auto max-h-[65vh]">
  <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
    <thead className="bg-gray-200 text-gray-600">
      <tr>
        <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Ownership Title</th>
        <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Name</th>
        <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Address</th>
        <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Payment Type</th>
        <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Phone</th>
        <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Email</th>
        <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide">Unit</th>
        <th className="px-6 py-4 text-center font-semibold text-sm tracking-wide">Actions</th>
      </tr>
    </thead>
    <tbody>
      {propertyData.map((property, index) => (
        <tr
          key={property._id}
          className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
        >
          <td className="px-6 py-4 text-gray-800">{property?.ownershipTitle}</td>
          <td className="px-6 py-4 text-gray-800">{property?.name || "N/A"}</td>
          <td className="px-6 py-4 text-gray-800">{property?.address || "N/A"}</td>
          <td className="px-6 py-4 text-gray-800">{property?.paymentType || "N/A"}</td>
          <td className="px-6 py-4 text-gray-800">{property?.phone || "N/A"}</td>
          <td className="px-6 py-4 text-gray-800">{property?.email || "N/A"}</td>
          <td className="px-6 py-4 text-gray-800">{property?.unit || "N/A"}</td>
          <td className="px-6 py-4 text-center min-w-[150px] flex justify-center gap-2">
            <button
              onClick={() => onDelete(property._id)}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none"
              title="Delete Property"
            >
              <FaTrash size={16} />
            </button>

            <button
              onClick={() => editHandle(property._id)}
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 focus:outline-none"
              title="Edit Property"
            >
              <FaEdit size={16} />
            </button>

            <button
              onClick={() => DuplicateHandle(property._id)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none"
              title="Duplicate Property"
            >
              <GrDuplicate size={16} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowForm(false)} // Close modal when clicking on the background
        >
          <div
            className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-4xl min-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()} // Prevent background click from closing modal
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setShowForm(false)}
            >
              ✖
            </button>

            {/* Form Fields */}
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

            <PhoneInput
              country={"us"}
              value={phone}
              onChange={(phone) => setPhone(phone)}
              inputStyle={{
                width: "100%",
                height: "45px",
                borderRadius: "8px",
                padding: "10px",
                paddingLeft: "45px",
                border: "1px solid #e5e7eb",
                fontSize: "16px",
              }}
              containerStyle={{
                width: "100%",
                marginBottom: "16px",
              }}
              buttonStyle={{
                border: "1px solid #e5e7eb",
                borderRight: "none",
              }}
              dropdownStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
              }}
              placeholder="Enter phone number"
            />

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />

            <label htmlFor="unit" className="block mb-2">
              Select Unit
            </label>
            <select
              id="unit"
              value={unit.type}
              onChange={handleUnitChange}
              className="border p-2 w-full rounded-lg"
            >
              <option value="">Select a unit</option>
              {unitsData.map((unitData) => (
                <option key={unitData._id} value={unitData.type}>
                  {unitData.type} - {unitData.currency} {unitData.fee}
                </option>
              ))}
            </select>
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
            <div className="flex justify-center items-center mt-6">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Update Owner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetOwner;
