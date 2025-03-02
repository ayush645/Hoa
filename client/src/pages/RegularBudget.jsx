import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const RegularBudget = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      {/* Home Button (Fixed at Top) */}
      <div className="w-full flex justify-start mb-8">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition duration-300 shadow-lg"
        >
          Go to Home
        </button>
      </div>

      {/* Budget Options */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full h-full">
        {/* Income Button */}
        <Link
          to={`/regularbudget/income/${id}`}
          className="px-6 py-3 text-lg font-semibold bg-green-500 rounded-lg hover:bg-green-600 transition duration-300 shadow-lg text-center w-40"
        >
          Income
        </Link>

        {/* Outcome Button */}
        <Link
          to={`/regularbudget/outcome/${id}`}
          className="px-6 py-3 text-lg font-semibold bg-red-500 rounded-lg hover:bg-red-600 transition duration-300 shadow-lg text-center w-40"
        >
          Outcome
        </Link>

        {/* Balance Button */}
        <Link
          to={`/regularbudget/balance/${id}`}
          className="px-6 py-3 text-lg font-semibold bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300 shadow-lg text-center w-40"
        >
          Balance
        </Link>
      </div>
    </div>
  );
};

export default RegularBudget;
