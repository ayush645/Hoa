import React, { useEffect, useState } from "react";
import { getPropertyInformationApi } from "../services/operation/function";

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="property-info-container p-6 min-h-screen">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Property Information
        </h2>

        {/* Print Button */}
        <div className="text-center mb-6">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            Print Information
          </button>
        </div>

        {propertyData.map((property) => (
          <div
            key={property._id}
            className="property-card relative max-w-7xl mx-auto bg-white shadow-lg p-6 rounded-lg mb-8 transition-transform transform hover:scale-105"
          >
            {/* Property Details */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              <strong>Property Name:</strong> {property.pName}
            </h3>
            <p className="text-gray-600 mb-2">
              <strong>Property Address:</strong> {property.pAddress}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Property ownership title:</strong> {property.ownerTitle}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Property number of units:</strong>{" "}
              {property.numberOfunits}
            </p>

            {/* Images and Map */}
            <div className="grid lg:grid-cols-2 gap-2">
              {/* Images */}
              {property.images.length > 0 && (
                <div>
                  <h4 className="text-center py-2">Property Images</h4>
                  <div>
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

              <div>
                <h4 className="text-center py-2">Location Map</h4>
                <iframe
                  src={property?.pLocation}
                  className="w-full h-64 rounded-lg shadow-sm"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintInformation;
