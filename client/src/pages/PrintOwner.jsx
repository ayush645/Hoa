import React, { useEffect, useState } from "react";
import { getOwnerApi } from "../services/operation/function";

const PrintOwner = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPropertyInformation = async () => {
    try {
      setLoading(true);
      const data = await getOwnerApi();
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
          Property Owner
        </h2>

        {/* Print Button */}
        <div className="text-center mb-6">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            Print Owner
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
                  Name
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  Address
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  Phone
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  Unit
                </th>
                <th className="px-4 py-2 text-center text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {propertyData.map((property, index) => (
                <tr
                  key={property._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-gray-800">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-800">
                    {property?.name || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {property?.address || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {property?.phone || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {property?.email || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {property?.unit || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrintOwner;
