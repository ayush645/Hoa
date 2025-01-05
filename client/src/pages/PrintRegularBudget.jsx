import React from "react";
import { Link } from "react-router-dom";

const PrintRegularBudget = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto p-5 grid lg:grid-cols-3 gap-5">
        <Link
          to="/print/regular-budget/income"
          className="button-85 text-center"
        >
          Incomes
        </Link>
        <Link
          to="/print/regular-budget/outcome"
          className="button-85 text-center"
        >
          OutComes
        </Link>
        <Link
          to="/print/regular-budget/balance"
          className="button-85 text-center"
        >
          Balance
        </Link>
      </div>
    </div>
  );
};

export default PrintRegularBudget;
