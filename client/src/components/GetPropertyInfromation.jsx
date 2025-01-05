import React from "react";
import { FaTrash } from "react-icons/fa";

const GetPropertyInformation = ({ propertyData, loading, onDelete }) => {
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
    <div className="property-info-container px-6 py-12 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
        Property Information
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {propertyData.map((property) => (
          <div
            key={property._id}
            className="property-card bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Header Section */}
            <div className="flex justify-between items-center p-4 bg-blue-50 border-b">
              <div className="flex items-center gap-3">
                <img
                  src={property.logo.url}
                  alt="Property Logo"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-700">
                  {property.pName}
                </h3>
              </div>
              <button
                onClick={() => onDelete(property._id)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none"
                title="Delete Property"
              >
                <FaTrash size={16} />
              </button>
            </div>

            {/* Property Details */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600">
                <strong>Address:</strong> {property.pAddress}
              </p>
              <p className="text-gray-600">
                <strong>Ownership Title:</strong> {property.ownerTitle}
              </p>
              <p className="text-gray-600">
                <strong>Number of Units:</strong> {property.numberOfunits}
              </p>
            </div>

            {/* Images and Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6 pb-6">
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
    </div>
  );
};

export default GetPropertyInformation;
