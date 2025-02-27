import React, { useEffect, useState } from "react";
import { getPropertyInformationApi } from "../services/operation/function";
import axios from "axios";

const PrintInformation = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPropertyInformation = async () => {
    try {
      setLoading(true);
      const data = await getPropertyInformationApi();
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

   const handlePrint = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/print/propertyinformation`,
        {
          responseType: "blob", // Important for handling binary data
        }
      );

      // Create a Blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link and simulate a click
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `property.pdf`); // Set filename
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
    <div className="bg-gray-100 min-h-screen py-8">
      {/* Header with Logo */}
      <div className="text-center mb-10">
       
        <h2 className="text-4xl font-bold text-blue-600 mt-4">
          Property Information
        </h2>
      </div>

      {/* Print Button */}
      <div className="text-center mb-6">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
        >
          Print Information
        </button>
      </div>

      {/* Property Cards */}
      <div className="property-info-container px-6">
        {loading ? (
          <p className="text-center text-gray-500 text-lg font-semibold">
            Loading property information...
          </p>
        ) : propertyData.length === 0 ? (
          <p className="text-center text-red-500 text-lg font-semibold">
            No property information found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyData.map((property) => (
              <div
                key={property._id}
                className="property-card bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Header with Property Logo */}
                <div className="flex items-center p-4 bg-blue-50 border-b">
                  <img
                    src={property.logo.url}
                    alt="Property Logo"
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {property.pName}
                  </h3>
                </div>


                {/* Property Details */}
                <div className="p-6">
                  <p className="text-gray-600 mb-2">
                    <strong>Address:</strong> {property.pAddress}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Ownership Title:</strong> {property.ownerTitle}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>Number of Units:</strong> {property.numberOfunits}
                  </p>
                </div>

                {/* Images and Map */}
                <div className="grid grid-cols-1 gap-4 px-6 pb-6">
                  {property.images.length > 0 && (
                    <div>
                      <h4 className="text-center text-blue-600 mb-2 font-medium">
                        Property Images
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {property.images.map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt={`Property Image ${index + 1}`}
                            className="w-full object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {property.pLocation && (
                    <div>
                      <h4 className="text-center text-blue-600 mb-2 font-medium">
                        Location Map
                      </h4>
                      <iframe
                        src={property.pLocation}
                        className="w-full h-64 rounded-lg shadow-sm border"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Property Location"
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintInformation;
