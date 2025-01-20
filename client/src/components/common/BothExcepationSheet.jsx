import React, { useEffect, useState } from "react";

const BothExcepationSheet = ({ income, outCome }) => {
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    // Function to merge income and outcome data based on the time
    const mergeIncomeAndOutcome = (income, outCome) => {
        console.log(income)
      // Combine both income and outcome data into one array
      const combinedData = [
        ...income.map(item => ({
          ...item,
          type: 'income',
          operation:item?.updateLog[0]?.operation,
         time: new Date(item.createdAt).getTime(), // Use createdAt instead of date
          amount: parseFloat(item.amount) || 0, // Directly convert amount to number
        })),
        ...outCome.map(item => ({
          ...item,
          type: 'outcome',
          operation:item?.updateLog[0]?.operation,
          time: new Date(item.createdAt).getTime(), // Use createdAt instead of date
          amount: parseFloat(item.amount) || 0, // Directly convert amount to number
        }))
      ];

      // Sort by time
      combinedData.sort((a, b) => a.time - b.time);

      return combinedData;
    };

    // Set the merged and sorted data
    const mergedResult = mergeIncomeAndOutcome(income, outCome);
    setMergedData(mergedResult);
  }, [income, outCome]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Balance Statement</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-2">Time</th>
              <th className="border border-gray-200 p-2">Operation</th>
              <th className="border border-gray-200 p-2">Amount</th>
              <th className="border border-gray-200 p-2">Type</th>
            </tr>
          </thead>
          <tbody className=" text-white">
            {mergedData.map((entry, index) => {
              const color = entry.type === 'income' ? 'text-green-500' : 'text-red-500';
              const sign = entry.type === 'income' ? '+' : '-';
             if(!entry.operation){
              return null
             }
              return (
                <tr key={index}>
                  <td className="border border-gray-200 p-2">
                    {new Date(entry.createdAt).toLocaleString()} {/* Use createdAt */}
                  </td>
                  <td className="border border-gray-200 p-2">{entry.operation}</td> {/* Assuming 'name' is the operation */}
                  <td className={`border border-gray-200 p-2 ${color}`}>
                    {sign} ₹{entry.amount.toFixed(2)}
                  </td>
                  <td className="border border-gray-200 p-2">
                    {entry.type === 'income' ? 'Income' : 'Outcome'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BothExcepationSheet;
