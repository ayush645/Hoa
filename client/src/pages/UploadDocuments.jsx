import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Import SweetAlert2 styles
import { useParams } from 'react-router-dom';

const BudgetOutcomeList = ({ categoryId }) => {
  const [budgetOutcomes, setBudgetOutcomes] = useState([]);
  const [loading, setLoading] = useState(true);
    const {id} = useParams()
  // Fetch BudgetOutcomes based on categoryId
  useEffect(() => {
    const fetchBudgetOutcomes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/budgetoutcome/document/${id}`);
        if (response.data.status === 'success') {
          setBudgetOutcomes(response.data.data);
          console.log(response.data.data)
          setLoading(false);

          // Show success message using SweetAlert2
         
        }
      } catch (error) {
        setLoading(false);

        // Show error message using SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: error.response?.data?.message || 'Something went wrong!',
          confirmButtonText: 'OK',
        });
      }
    };

    fetchBudgetOutcomes();
  }, [id]);

  // Handle document download
  const handleDownload = (url, fileName) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'document';
    link.click();
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {budgetOutcomes.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold text-center mb-6 text-white">Budget Outcomes</h2>
          <ul className="space-y-4">
            {budgetOutcomes.map((outcome) => (
              <li key={outcome._id} className="bg-white p-4 shadow-md rounded-lg">
                <div className="mb-2">
                  <strong className="text-gray-700">Category:</strong> {outcome.categoryId.name}
                </div>
                <div className="mb-2">
                  <strong className="text-gray-700">Amount:</strong> {outcome.amount}
                </div>
                {outcome.document.url && (
                  <div>

                  <img src={outcome.document.url} alt="" />
                    
                    <button
                      className="text-blue-500 underline"
                      onClick={() => handleDownload(outcome.document.url, 'document.pdf')}
                    >
                      Download Document
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-500">No budget outcomes found for this category.</p>
      )}
    </div>
  );
};

export default BudgetOutcomeList;
