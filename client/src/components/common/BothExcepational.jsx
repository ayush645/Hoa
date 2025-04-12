import React, { useEffect, useState } from "react";
import { getBudgetIncomeApi, getBudgetOutcomeApi } from "../../services/operation/function";
import BothExcepationSheet from "./BothExcepationSheet";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function BothExcepational() {
    const [budgetData, setBudgetData] = useState({
        income: [],
        outcome: [],
      });
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const { id } = useParams(); // Getting categoryId directly from the URL

      useEffect(() => {
        // Fetching data using axios
        const fetchData = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/get-budget-data/${id}`);
            // Set the data to state
            console.log(response.data.data)
            setBudgetData(response.data.data);
            setLoading(false);
          } catch (err) {
            setError('Failed to fetch budget data');
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);
    
      if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>{error}</div>;
      }
    
  return <div>

    <BothExcepationSheet income={budgetData.income} outCome={budgetData.outcome} />
  </div>;
}

export default BothExcepational;
