import { useState } from "react";
import axios from "axios";

const BackupRestore = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // 📌 Backup Download Function
  const handleBackupDownload = async () => {
    try {
        const response = await axios.post("http://localhost:8080/api/v1/backups/backup", null, {
            responseType: "blob", // Important for file download
        });

        // Creating download link
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "backup.json");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Cleanup

        setMessage("Backup downloaded successfully!");
    } catch (error) {
        console.error("Error downloading backup:", error);
        setMessage("Error downloading backup.");
    }
};


  // 📌 File Selection for Restore
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      const reader = new FileReader();
      reader.readAsText(uploadedFile);
      reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result);
          setFile(jsonData);
        } catch (error) {
          setMessage("Invalid JSON file.");
        }
      };
    }
  };

  // 📌 Restore Upload Function
  const handleRestore = async () => {
    if (!file) {
      setMessage("Please select a valid JSON file.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/v1/restores/restore", file, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error restoring backup.");
    }
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2">Backup & Restore</h2>

      {/* 📌 Backup Download Button */}
      <button onClick={handleBackupDownload} className="bg-green-500 text-white px-4 py-2 rounded mb-2">
        Download Backup
      </button>

      <hr className="my-3" />

      {/* 📌 Restore Upload */}
      <input type="file" accept=".json" onChange={handleFileChange} className="mb-2 p-2 border" />
      <button onClick={handleRestore} className="bg-blue-500 text-white px-4 py-2 rounded">
        Restore Backup
      </button>

      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
};

export default BackupRestore;
