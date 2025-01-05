import React from "react";
import { Link } from "react-router-dom";

const Print = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto p-5 grid lg:grid-cols-2 gap-5">
        <Link
          to="/print/property-information"
          className="button-85 text-center"
        >
          Property Information
        </Link>
        <Link to="/print/regular-budget" className="button-85 text-center">
          Regular budget
        </Link>
        <Link to="/print/property-comitee" className="button-85 text-center">
          Property Comitee
        </Link>
        <Link to="/print/exceptional" className="button-85 text-center">
          Exceptional budget
        </Link>
        <Link to="/print/owner" className="button-85 text-center">
          Property owners
        </Link>
      </div>
    </div>
  );
};

export default Print;
