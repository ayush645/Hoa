import React, { useState } from "react";
import { axiosInstance } from "../../services/apiConnector";
import Swal from "sweetalert2"; // Make sure SweetAlert is installed: npm install sweetalert2
import axios from "axios";

function NotificationsSender({ ownerId, dueMonth }) {
  const [followingMonth, setFollowingMonth] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const sendDueMonthNotification = async () => {
    try {
      // Show confirmation dialog to the user
      const { isConfirmed } = await Swal.fire({
        title: "Are you sure?",
        text: `Send a due notification for ${dueMonth}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, send it!",
      });
  
      if (isConfirmed) {
        // Show loading spinner while the request is in progress
        const loadingSwal = Swal.fire({
          title: 'Sending...',
          text: 'Please wait while we send the email.',
          icon: 'info',
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });
  
        // Make the POST request
        const response = await axios.post(`${BASE_URL}/mail/dueMail`, {
          ownerId,
          dueMonth,
        });
  
        // Close the loading Swal
        loadingSwal.close();
  
        // Handle successful response
        if (response.status === 200) {
          await Swal.fire("Success", "Email sent successfully!", "success");
        } else {
          throw new Error(response.data?.error || "Failed to send email");
        }
      }
    } catch (error) {
      // Close the loading Swal if there is an error
      Swal.close();
      
      // Log and display error message
      console.error("Error while sending due notification:", error);
      await Swal.fire("Error", error.message || "Something went wrong!", "error");
    }
  };
  
  
  

  const sendPartialAmountNotification = async() => {
    if (!followingMonth || !newDueDate) {
      alert("Please fill in both Following Month and New Due Date.");
      return;
    }
 
  
    try {
        // Show confirmation dialog to the user
        const { isConfirmed } = await Swal.fire({
          title: "Are you sure?",
          text: `Send a partialPayment notification for ${dueMonth}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, send it!",
        });
    
        if (isConfirmed) {
          // Show loading spinner while the request is in progress
          const loadingSwal = Swal.fire({
            title: 'Sending...',
            text: 'Please wait while we send the email.',
            icon: 'info',
            showConfirmButton: false,
            willOpen: () => {
              Swal.showLoading();
            },
          });
    
          // Make the POST request
          const response = await axios.post(`${BASE_URL}/mail/partialPayment`, {
            ownerId,
            dueMonth,
            followingMonth,
            newDueDate

          });
    
          // Close the loading Swal
          loadingSwal.close();
    
          // Handle successful response
          if (response.status === 200) {
            await Swal.fire("Success", "Email sent successfully!", "success");
          } else {
            throw new Error(response.data?.error || "Failed to send email");
          }
        }
      } catch (error) {
        // Close the loading Swal if there is an error
        Swal.close();
        
        // Log and display error message
        console.error("Error while sending due notification:", error);
        await Swal.fire("Error", error.message || "Something went wrong!", "error");
      }
    // Add your API or notification logic here
  };

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Send Notifications
      </h2>

      {/* Due Month Notification Button */}
      <button
        onClick={sendDueMonthNotification}
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition mb-6"
      >
        Send Due Month Notification
      </button>

      {/* Partial Amount Notification Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Send Partial Amount Notification
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Following Month
          </label>
          <input
            type="text"
            value={followingMonth}
            onChange={(e) => setFollowingMonth(e.target.value)}
            placeholder="Enter Following Month"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Due Date
          </label>
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={sendPartialAmountNotification}
          className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
        >
          Send Partial Amount Notification
        </button>
      </div>
    </div>
  );
}

export default NotificationsSender;
