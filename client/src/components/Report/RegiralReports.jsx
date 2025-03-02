import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAllIncomeApi,
  getAllOutcomeApi,
} from "../../services/operation/function";

const ReguralReport = ({ type, mainData }) => {
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const main = mainData;
  // /BalanceStatement
  const [outCome, setOutComeState] = useState([]);
  const [income, setIncomeState] = useState([]);

  // Fetch income data
  const fetchIncome = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = main;
      const allUpdateLogs = data.flatMap((item) => item.updateLog || []);

      console.log(allUpdateLogs);
      // Sort the concatenated array by 'createdAt' (ascending order)
      const sortedUpdateLogs = allUpdateLogs.sort((a, b) => {
        return new Date(b.date) - new Date(a.date); // Ascending order
      });

      setIncomeState(sortedUpdateLogs);
    } catch (error) {
      console.error("Error fetching income data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch outcome data
  const fetchOutcome = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getAllOutcomeApi(id);
      console.log(data);

      const allUpdateLogs = data.flatMap((item) => item.updateLog || []);

      console.log(allUpdateLogs);
      // Sort the concatenated array by 'createdAt' (ascending order)
      const sortedUpdateLogs = allUpdateLogs.sort((a, b) => {
        return new Date(b.date) - new Date(a.date); // Ascending order
      });

      setOutComeState(sortedUpdateLogs);
    } catch (error) {
      console.error("Error fetching outcome data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
    fetchOutcome();
  }, [mainData]);

  useEffect(() => {
    // Filter data based on the type
    const filterDataByType = () => {
      if (type === "income") {
        return income.map((item) => ({
          ...item,
          type: "income",
          time: new Date(item.date).getTime(),
          amount: parseFloat(Object.values(item.updatedFields)[0]) || 0,
        }));
      } else if (type === "outcome") {
        return outCome.map((item) => ({
          ...item,
          type: "outcome",
          time: new Date(item.date).getTime(),
          amount: parseFloat(Object.values(item.updatedFields)[0]) || 0,
        }));
      }
      return [];
    };

    setFilteredData(filterDataByType());
  }, [income, outCome, type]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">
        {type === "income" ? "Income Statement" : "Outcome Statement"}
      </h2>
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
                entry.type === "income" ? "text-green-500" : "text-red-500";
              const sign = entry.type === "income" ? "+" : "-";

              // Date and Time Extraction
              const dateObj = new Date(entry.date);
              const formattedDate = dateObj.toLocaleDateString(); // Extract Date
              const formattedTime = dateObj.toLocaleTimeString(); // Extract Time

              return (
                <tr key={index}>
                  <td className="border border-gray-200 p-2">
                    {formattedDate}
                  </td>
                  <td className="border border-gray-200 p-2">
                    {formattedTime}
                  </td>
                  <td className="border border-gray-200 p-2">
                    {entry?.operation}
                  </td>
                  <td className={`border border-gray-200 p-2 ${color}`}>
                    {sign} ₹{entry.amount.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReguralReport;
