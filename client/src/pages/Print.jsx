import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const Print = () => {




  const handleDownloadUnits = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/print/units`, {
        responseType: "blob", // Important for handling binary data
      });

      // Create a Blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link and simulate a click
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `property.pdf`); // Set filename
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the PDF:", error);
      alert("Failed to download PDF.");
    }
  };

 
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
        <button 
        onClick={handleDownloadUnits}
        className="button-85 text-center">
         Download Units Report
        </button>
        
      </div>
    </div>
  );
};

export default Print;
