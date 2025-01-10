import React, { useEffect, useState } from "react";
import { FaTrash,FaRegEdit } from "react-icons/fa"; // Import Trash Icon

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getAllOwnerApi } from "../services/operation/function";
import axios from 'axios';
import Swal from 'sweetalert2';

const GetPropertyCommiti = ({ propertyData, loading, onDelete,id,fetchCommiti }) => {
  
  const [name, setName] = useState("Select Owner");
  const [position, setPosition] = useState("President");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState("");
  const [currency, setCurrency] = useState("USD"); // Default value
  const [showForm, setShowForm] = useState(false);
  const [ibanError, setIbanError] = useState("");
  const [owners, setOwners] = useState();
const[selectId,setSeleteId] = useState(null)


  const isValidIBAN = (iban) => {
    const regex = /^[A-Z0-9]{15,34}$/;
    return regex.test(iban);
  };

 
  const handleSubmit = async () => {
    const propertyData = {
      name,
      position,
      phone,
      email,
      account,
      currency,
      id: selectId,
    };
  
    try {
      // Send the PUT request
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/propertycommiti/update/${selectId}`, propertyData);
  
      // Check if the response indicates success
      if (response.data.success) {
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Property updated successfully.',
          confirmButtonText: 'OK',
        });
  
        // Reset form and hide modal
        setName('');
        setPosition('');
        setPhone('');
        setEmail('');
        setAccount('');
        setCurrency('USD');
        setShowForm(false);
        fetchCommiti()
      } else {
        // Show error alert if not successful
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to update the property. Please try again.',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      // Show error alert if the request fails
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        confirmButtonText: 'OK',
      });
    }
  };
  

  const handleAccountChange = (e) => {
    const value = e.target.value.toUpperCase(); // Ensure the account number is in uppercase
    setAccount(value);

    // Validate IBAN format using the isValidIBAN function from the 'iban' package
    if (value && !isValidIBAN(value)) {
      setIbanError("Invalid IBAN format.");
    } else {
      setIbanError("");
    }
  };


  const fetchProperty = async (propertyId) => {
    try {
      // Make the GET request using Axios
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/propertycommiti/get/${propertyId}`);
  
      if (response.data.success) {
        const { property } = response.data;
  
        // Update the state with the fetched data
        setName(property.name || "Select Owner");
        setPosition(property.position || "President");
        setPhone(property.phone || "");
        setEmail(property.email || "");
        setAccount(property.account || "");
        setCurrency(property.currency || "USD");
      } else {
        console.error('Property not found');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    }
  };
  

const handleEdit = async(id)=>{
  setShowForm(true)
  setSeleteId(id)
  fetchProperty(id)
}


  const fetchOwners = async () => {
    try {
      
      const data = await getAllOwnerApi(id); // Fetch owner data
      setOwners(data); // Store owner data in state
    } catch (error) {
      console.error("Error fetching owner data:", error);
    } finally {
      
    }
  };

    useEffect(() => {
       fetchOwners();
    }, [id]);


  if (loading) {
    return (
      <p className="text-center text-gray-500 text-lg font-semibold">
        Loading property information...
      </p>
    );
  }

  if (propertyData.length === 0) {
    return (
      <p className="text-center text-red-500 text-lg font-semibold">
        No property information found.
      </p>
    );
  }

  return (
    <div className="property-info-container p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Property Commiti
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Code
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Full Name
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Position of Responsibility
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Phone
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Email
              </th>
              <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                Bank Account
              </th>
           
              <th className="px-4 py-2 text-center text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {propertyData.map((property, index) => (
              <tr
                key={property?._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2 text-gray-800">{index + 1}</td>
                <td className="px-4 py-2 text-gray-800">{property?.name}</td>
                <td className="px-4 py-2 text-gray-800">
                  {property?.position}
                </td>
                <td className="px-4 py-2 text-gray-800">{property?.phone}</td>
                <td className="px-4 py-2 text-gray-800">{property?.email}</td>
                <td className="px-4 py-2 text-gray-800">{property?.account}</td>
            
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => onDelete(property?._id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none"
                    title="Delete Property"
                  >
                    <FaTrash size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(property?._id)}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none"
                    title="Delete Property"
                  >
                    <FaRegEdit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="form bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-4xl relative">
      <button
        className="absolute top-1 right-2 text-gray-700 text-4xl"
        onClick={() => setShowForm(false)}
      >
        &times;
      </button>
      <label className="block mb-2">Select or Enter Full Name</label>
      <select
        value={name || "manual"} // Default to "manual" if name is empty
        onChange={(e) => {
          if (e.target.value === "manual") {
            setName(""); // Clear the name field for manual input
          } else {
            setName(e.target.value); // Set selected owner name
          }
        }}
        className="border p-2 w-full mb-4 rounded-lg"
      >
        <option value="">Select Owner</option>
        {owners.map((owner) => (
          <option key={owner.id} value={owner.name}>
            {owner.name}
          </option>
        ))}
        <option value="manual">No Found</option>
      </select>

      {/* Show input field only if "Enter Manually" is selected */}
      {name === "" && (
        <input
          type="text"
          placeholder="Enter Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-4 rounded-lg"
        />
      )}

      <label className="block mb-2">
        Select or Enter Position of Responsibility
      </label>
      <select
        value={position || "manual"} // Default to "manual" if position is empty
        onChange={(e) => {
          if (e.target.value === "manual") {
            setPosition(""); // Clear the position field for manual input
          } else {
            setPosition(e.target.value); // Set selected position
          }
        }}
        className="border p-2 w-full mb-4 rounded-lg"
      >
        {/* Predefined options */}
        <option value="President">President</option>
        <option value="Vice President of Operations">
          Vice President of Operations
        </option>
        {/* Add more options here */}
        <option value="manual">No Found</option>
      </select>

      {/* Show input field only if "Enter Manually" is selected */}
      {position === "" && (
        <input
          type="text"
          placeholder="Enter Position of Responsibility"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border p-2 w-full mb-4 rounded-lg"
        />
      )}

      <PhoneInput
        country={"us"} // Default country
        value={phone}
        onChange={(phone) => setPhone(phone)}
        inputStyle={{
          width: "100%",
          height: "45px",
          borderRadius: "8px",
          padding: "10px",
          paddingLeft: "45px", // Adjust for the flag and dropdown
          border: "1px solid #e5e7eb", // Tailwind's `border-gray-300`
          fontSize: "16px",
        }}
        containerStyle={{
          width: "100%",
          marginBottom: "16px",
        }}
        buttonStyle={{
          border: "1px solid #e5e7eb", // Tailwind's `border-gray-300`
          borderRight: "none",
        }}
        dropdownStyle={{
          backgroundColor: "#ffffff", // Tailwind's `bg-white`
          border: "1px solid #e5e7eb", // Tailwind's `border-gray-300`
          borderRadius: "0.375rem", // Tailwind's `rounded-md`
        }}
        placeholder="Enter phone number"
      />

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-4 rounded-lg"
      />
      <input
        type="text"
        placeholder="Enter Bank Account"
        value={account}
        onChange={handleAccountChange}
        className="border p-2 w-full mb-4 rounded-lg"
      />

      {/* Display error message if IBAN is invalid */}
      {ibanError && <p className="text-red-500 text-sm">{ibanError}</p>}

      {/* <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="border p-2 w-full mb-4 rounded-lg"
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="INR">INR</option>
        <option value="GBP">GBP</option>
        <option value="JPY">JPY</option>
      </select> */}

      <div className="flex justify-center items-center">
        <button onClick={handleSubmit} className="button-85">
          Create Property Committi
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default GetPropertyCommiti;
