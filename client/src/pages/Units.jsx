import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  handleCreateUnitsAPi,
  getAllUnitsApi,
  deleteUnitsApi,
} from "../services/operation/function";
import GetUnits from "../components/GetUnits";
import axios from "axios";

const Units = () => {
  const [type, setType] = useState("");
  const [fee, setFee] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("USD"); // Currency state


  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const propertyData = {
      type,
      fee,
      categoryId: id,
      currency
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


  const handleDownloadUnits = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/print/units/${id}`, {
        responseType: "blob", // Important for handling binary data
      });

      // Create a Blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link and simulate a click
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Unit_Report.pdf`); // Set filename
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
          <button onClick={() => navigate("/")} className="button-85">
            Go to Home
          </button>
          <button className="button-85" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Add units Information"}
          </button>
          <button onClick={handleDownloadUnits} className="button-85">
            Print Units
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

<div className="mb-4">
              <label htmlFor="currency" className="block mb-2">Currency</label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border p-2 w-full rounded-lg"
              >
                <option value="USD">USD</option>
<option value="EUR">EUR</option>
<option value="INR">INR</option>
<option value="GBP">GBP</option>
<option value="JPY">JPY</option>
<option value="AUD">AUD</option>
<option value="CAD">CAD</option>
<option value="CHF">CHF</option>
<option value="CNY">CNY</option>
<option value="SEK">SEK</option>
<option value="NZD">NZD</option>
<option value="MXN">MXN</option>
<option value="SGD">SGD</option>
<option value="HKD">HKD</option>
<option value="NOK">NOK</option>
<option value="KRW">KRW</option>
<option value="TRY">TRY</option>
<option value="RUB">RUB</option>
<option value="BRL">BRL</option>
<option value="ZAR">ZAR</option>
<option value="MYR">MYR</option>
<option value="INR">INR</option>
<option value="PLN">PLN</option>
<option value="IDR">IDR</option>
<option value="THB">THB</option>
<option value="ARS">ARS</option>
<option value="AED">AED</option>
<option value="SAR">SAR</option>
<option value="EGP">EGP</option>
<option value="KES">KES</option>
<option value="CLP">CLP</option>
<option value="COP">COP</option>
<option value="PHP">PHP</option>
<option value="PEN">PEN</option>
<option value="VND">VND</option>
<option value="TWD">TWD</option>
<option value="RSD">RSD</option>
<option value="BGN">BGN</option>
<option value="HUF">HUF</option>
<option value="CZK">CZK</option>
<option value="HRK">HRK</option>
<option value="RON">RON</option>
<option value="LKR">LKR</option>
<option value="BHD">BHD</option>
<option value="OMR">OMR</option>
<option value="QAR">QAR</option>
<option value="KWD">KWD</option>
<option value="KGS">KGS</option>
<option value="UZS">UZS</option>
                {/* Add more currencies as needed */}
              </select>
            </div>

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
