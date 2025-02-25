import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BudgetOutcomeTable = ({ categoryId }) => {
  const [budgetOutcomes, setBudgetOutcomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchBudgetOutcomes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/budgetoutcome/document/${id}`
        );

        setBudgetOutcomes(response.data.data);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetOutcomes();
  }, [id]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-white">Budget Outcome Documents</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Document</th>
            </tr>
          </thead>
          <tbody>
            {budgetOutcomes.length > 0 ? (
              budgetOutcomes.map((outcome, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{outcome.type}</td>
                  <td className="border px-4 py-2">${outcome.amount}</td>
                  <td className="border px-4 py-2">
                    {new Date(outcome.date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(outcome.date).toLocaleTimeString()}
                  </td>

                  <td className="border px-4 py-2 text-center">
                    {outcome.document?.url ? (
                      <div>
                        <img
                          src={outcome.document.url}
                          alt="Document Preview"
                          className="w-24 h-24 object-cover mx-auto mb-2"
                        />
                        <a
                          href={outcome.document.url}
                          download
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Download
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400">No Document</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center border px-4 py-2">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetOutcomeTable;
