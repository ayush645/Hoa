import axios from "axios";

const DownloadPDFButton = ({  }) => {
 
  const handleDownload = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/print/owner`, {
        responseType: "blob", // Important for handling binary data
      });

      // Create a Blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link and simulate a click
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `units.pdf`); // Set filename
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
    <button
      onClick={handleDownload}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Download Property PDF
    </button>
  );
};

export default DownloadPDFButton;
