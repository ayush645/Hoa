import React from "react";
import { Link, useParams } from "react-router-dom";

const RegularBudget = () => {
  const { id } = useParams();

  return (
    <div className="flex justify-center mx-auto space-x-4 text-white mt-6">
      {/* Income Button */}
      <Link
        to={`/regularbudget/income/${id}`}
        className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600 transition"
      >
        Income
      </Link>

      {/* Outcome Button */}
      <Link
        to={`/regularbudget/outcome/${id}`}
        className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
      >
        Outcome
      </Link>

      {/* Balance Button */}
      <Link
        to={`/regularbudget/balance/${id}`}
        className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        Balance
      </Link>
    </div>
  );
};

export default RegularBudget;
