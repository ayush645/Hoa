import axios from "axios";
import React from "react";
import { Link, useParams } from "react-router-dom";

const Print = () => {

const{id} = useParams()

console.log(id)

const propertyInformation = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/print/propertyinformation/${id}`,
      {
        responseType: "blob", // Important for handling binary data
      }
    );

    // Create a Blob from the response data
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a temporary link and simulate a click
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Property_Report.pdf`); // Set filename
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

const handleCommitee = async() => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/print/commiti/${id}`, {
      responseType: "blob", // Important for handling binary data
    });

    // Create a Blob from the response data
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a temporary link and simulate a click
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Committee_Report.pdf`); // Set filename
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

const handlePrintOwner = async() => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/print/owner/${id}`, {
      responseType: "blob", // Important for handling binary data
    });

    // Create a Blob from the response data
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a temporary link and simulate a click
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Owners_Report.pdf`); // Set filename
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



const handleDownloadUnits = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/print/units/${id}`, {
      responseType: "blob", // Important for handling binary data
    });

    // Create a Blob from the response data
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a temporary link and simulate a click
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Unit_Report.pdf`); // Set filename
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
        <button
        onClick={propertyInformation}
          className="button-85 text-center"
        >
          Property Information
        </button>
        <Link to="/print/regular-budget" className="button-85 text-center">
          Regular budget
        </Link>
        <button onClick={handleCommitee}  className="button-85 text-center">
          Property Comitee
        </button>
        <Link to="/print/exceptional" className="button-85 text-center">
          Exceptional budget
        </Link>
        <button onClick={handlePrintOwner}  className="button-85 text-center">
          Property owners
        </button>
        <button onClick={handleDownloadUnits} className="button-85 text-center">
        Units Report
        </button>
        {/* <button 
        onClick={handleDownloadUnits}
        className="button-85 text-center">
         Download Units Report
        </button> */}
        
      </div>
    </div>
  );
};

export default Print;
