import React, { useEffect, useState } from 'react';
import BalanceStatement from './BalanceStatement';

function RegularStatement() {
  // State to store the fetched data
  const [incomeLogs, setIncomeLogs] = useState([]);
  const [outcomeLogs, setOutcomeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch income logs when the component mounts
  useEffect(() => {
    const fetchIncomeLogs = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/income/all/get');
        if (!response.ok) {
          throw new Error('Failed to fetch income logs');
        }
        const data = await response.json();
        setIncomeLogs(data.InComeLogs); // Assuming the response contains InComeLogs
        setOutcomeLogs(data.outComeLogs); // Assuming the response contains InComeLogs
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeLogs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
     <BalanceStatement  income={incomeLogs} outCome={outcomeLogs}/>
    </div>
  );
}

export default RegularStatement;
