import React, { useEffect, useState } from "react";
import { getCommitiApi } from "../services/operation/function";
import axios from "axios";

const PrintCommiti = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPropertyInformation = async () => {
    try {
      setLoading(true);
      const data = await getCommitiApi();
      setPropertyData(data);
    } catch (error) {
      console.error("Error fetching property information:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyInformation();
  }, []);

  const handlePrint = async() => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/print/commiti`, {
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
    <div>
      <div className="property-info-container p-6 min-h-screen">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Property Comitee
        </h2>
        <div className="text-center mb-6">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            Print Comitee
          </button>
        </div>

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
                 
             
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrintCommiti;
