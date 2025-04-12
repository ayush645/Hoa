import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ExpeptionalReports({ type, change }) {
  const [budgetData, setBudgetData] = useState({
    income: [],
    outcome: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Getting categoryId directly from the URL

  useEffect(() => {
    console.log(change);
    // Fetching data using axios
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get-budget-data/${id}`
        );
        // Set the data to state
        console.log(response.data.data);
        setBudgetData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch budget data");
        setLoading(false);
      }
    };

    fetchData();
  }, [change]);

  // Filter data based on the type (either 'income' or 'outcome')
  const filteredData =
    type === "income" ? budgetData.income : budgetData.outcome;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Balance Statement</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 p-2">Date</th>
                <th className="border border-gray-200 p-2">Time</th>
                <th className="border border-gray-200 p-2">Operation</th>
                <th className="border border-gray-200 p-2">Amount</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {filteredData.map((entry, index) => {
                const color =
                  type === "income" ? "text-green-500" : "text-red-500";
                const sign = type === "income" ? "+" : "-";

                // Sort the updateLog by date (if it exists)
                const sortedUpdateLog = entry.updateLog;

                return (
                  <React.Fragment key={index}>
                    {sortedUpdateLog.length > 0 &&
                      sortedUpdateLog.map(
                        (logItem, logIndex) =>
                          logItem && (
                            <tr key={logIndex}>
                              <td className="border border-gray-200 p-2">
                                {new Date(logItem.date).toLocaleDateString()}{" "}
                                {/* Sirf Date */}
                              </td>
                              <td className="border border-gray-200 p-2">
                                {new Date(logItem.date).toLocaleTimeString()}{" "}
                                {/* Sirf Time */}
                              </td>

                              <td className="border border-gray-200 p-2">
                                {logItem.operation}
                              </td>
                              <td
                                className={`border border-gray-200 p-2 ${color}`}
                              >
                                {sign} 
                                
                                {logItem.currency}
                                {logItem.ammount}
                              </td>
                            </tr>
                          )
                      )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExpeptionalReports;
