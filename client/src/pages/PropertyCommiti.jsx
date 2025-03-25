import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  handleCreatePropertyCommitiAPi,
  getAllCommitiApi,
  deleteCommitiApi,
  getAllOwnerApi,
} from "../services/operation/function";
import GetPropertyCommiti from "../components/GetPropertyCommiti";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import ImageUploaderWithCrop from "../components/common/ImageUpload";

const PropertyCommiti = () => {
  const [name, setName] = useState("Select Owner");
  const [position, setPosition] = useState("President");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState("");
  const [currency, setCurrency] = useState("USD"); // Default value
  const [showForm, setShowForm] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [owners, setOwners] = useState();
  const [iban, setIban] = useState("");
  const [ibanError, setIbanError] = useState("");


      const [imageData, setImageData] = useState({ publicId: "", url: "" }); // State to store only public_id and url
      const [selectedImage, setSelectedImage] = useState(null); // Base64 image data
    
  

  const { id } = useParams();
  const navigate = useNavigate();

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
      categoryId: id,
      signature:imageData
    };

    const success = await handleCreatePropertyCommitiAPi(propertyData);

    if (success) {
      setName("");
      setPosition("");
      setPhone("");
      setEmail("");
      setAccount("");
      setCurrency("USD");
      setShowForm(false);
      fetchCommiti();
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

  const fetchCommiti = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getAllCommitiApi(id);
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
      const success = await deleteCommitiApi(propertyId);
      if (success) {
        fetchCommiti();
      }
    }
  };

  // get list of owners

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const data = await getAllOwnerApi(id); // Fetch owner data
      setOwners(data); // Store owner data in state
    } catch (error) {
      console.error("Error fetching owner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerSelect = (e) => {
    const selectedOwnerName = e.target.value;
  
    setName(selectedOwnerName);
  
    if (selectedOwnerName !== "manual") {
      // Find the selected owner from the list
      const selectedOwner = owners.find(owner => owner.name === selectedOwnerName);
  
      if (selectedOwner) {
      
        setPhone(selectedOwner?.phone || "");
        setEmail(selectedOwner?.email || "");
        setAccount(selectedOwner?.account || "");
      }
    } else {
      // Reset the fields if manual is selected
      
      setPhone("");
      setEmail("");
      setAccount("");
    }
  };
  

  useEffect(() => {
    fetchCommiti();
    fetchOwners();
  }, [id]);



  
  const handlePrint = async() => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/print/commiti/${id}`, {
        responseType: "blob", // Important for handling binary data
      });

      // Create a Blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link and simulate a click
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Committee_Report.pdf`); // Set filename
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the PDF:", error);
      alert("Failed to download PDF.");
    }
  };
  return (
    <div className="p-6 min-h-screen">
      <div className="property-page flex flex-col items-center mb-6">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
          <button onClick={() => navigate("/")}
          style={{ right: "442px" }}
           className="button-85">
            Go to Home
          </button>
       
        </div>

      </div>

      <GetPropertyCommiti
        propertyData={propertyData}
        loading={loading}
        onDelete={handleDelete}
        id={id}
        fetchCommiti={fetchCommiti}
      />


<div className=" flex flex-col justify-center items-center w-screen">
<div className="flex flex-wrap gap-3 justify-center items-center md:justify-start mb-6">
        
        <button className="button-85" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Property Comitte"}
        </button>
        <button onClick={handlePrint} className="button-85">
          Print Comitte
        </button>
      </div>

      {showForm && (
        <div className="form bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-4xl">
          <label className="block mb-2">Select or Enter Full Name</label>
          <select
value={name || "manual"}
onChange={handleOwnerSelect}
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
            <option value="Vice President of Administration">
              Vice President of Administration
            </option>
            <option value="Chancellor of Governance">
              Chancellor of Governance
            </option>
            <option value="Secretary">Secretary</option>
            <option value="Assistant Secretary">Assistant Secretary</option>
            <option value="Deputy Secretary">Deputy Secretary</option>
            <option value="Chancellor of Records">
              Chancellor of Records
            </option>
            <option value="Treasurer">Treasurer</option>
            <option value="Assistant Treasurer">Assistant Treasurer</option>
            <option value="Deputy Treasurer">Deputy Treasurer</option>
            <option value="Chancellor of Finance">
              Chancellor of Finance
            </option>
            <option value="Member-at-Large">Member-at-Large</option>
            <option value="Vice Member-at-Large (Operations)">
              Vice Member-at-Large (Operations)
            </option>
            <option value="Vice Member-at-Large (Community Relations)">
              Vice Member-at-Large (Community Relations)
            </option>
            <option value="Chancellor of Outreach">
              Chancellor of Outreach
            </option>
            <option value="Committee Chairs">Committee Chairs</option>
            <option value="Vice Chair of Strategy">
              Vice Chair of Strategy
            </option>
            <option value="Vice Chair of Execution">
              Vice Chair of Execution
            </option>
            <option value="Chancellor of Oversight">
              Chancellor of Oversight
            </option>
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
{ position==="President" && <ImageUploaderWithCrop
              setImageData={setImageData}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              title={"Upload Signature"}
            />}
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
      )}
</div>
    </div>
  );
};

export default PropertyCommiti;
