import React from "react";
import { Link } from "react-router-dom";

const ExpectesnalBudget = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto p-5 grid lg:grid-cols-2 gap-5">
        <Link to="/print/exceptional/income" className="button-85 text-center">
          Incomes
        </Link>
        <Link to="/print/exceptional/outcome" className="button-85 text-center">
          OutComes
        </Link>
      </div>
    </div>
  );
};

export default ExpectesnalBudget;
