import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/outcome/document/${id}`
        );

        setExpenses(response.data.data);
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [id]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-white">Expense Documents</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Expense Name</th>
              <th className="border px-4 py-2">Month</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Time</th>
              <th className="border px-4 py-2">Document</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) =>
                expense.documents.map((doc, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{expense.expense}</td>
                    <td className="border px-4 py-2">{doc.month}</td>
                    <td className="border px-4 py-2">${doc.amount}</td>
                    <td className="border px-4 py-2">
                      {new Date(doc.date).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(doc.date).toLocaleTimeString()}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {doc.url ? (
                        <div className="flex flex-col items-center">
                          {doc.url.match(/.(jpeg|jpg|png|gif)$/i) ? (
                            <img
                              src={doc.url}
                              alt="Document"
                              className="w-32 h-32 object-cover mb-2 border"
                            />
                          ) : null}
                          <a
                            href={doc.url}
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
              )
            ) : (
              <tr>
                <td colSpan="4" className="text-center border px-4 py-2">
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

export default ExpenseTable;
