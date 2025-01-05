import React, { useState } from "react";

const PaymentModal = ({ isOpen, onClose, onSubmit, month }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customAmount, setCustomAmount] = useState(0);
  const [futureMonth, setFutureMonth] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (option) => {
    let amount = 0;
    if (option === "fullyPaid") {
      amount = customAmount;
    } else if (option === "partiallyPaid") {
      amount = customAmount;
    }
    onSubmit({ month, amount, paymentMethod, futureMonth });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md">
        <h3 className="text-xl font-bold mb-4">Update Payment for {month}</h3>
        <button
          onClick={() => handleSubmit("notPaid")}
          className="bg-red-500 text-white p-2 rounded-md mb-2"
        >
          Not Paid
        </button>
        <button
          onClick={() => handleSubmit("fullyPaid")}
          className="bg-green-500 text-white p-2 rounded-md mb-2"
        >
          Fully Paid
        </button>
        <div className="mb-2">
          <label htmlFor="customAmount" className="block text-gray-700">
            Partially Paid Amount:
          </label>
          <input
            type="number"
            id="customAmount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
        </div>
        <button
          onClick={() => handleSubmit("partiallyPaid")}
          className="bg-yellow-500 text-white p-2 rounded-md mb-2"
        >
          Partially Paid
        </button>
        <div className="mb-2">
          <label htmlFor="futureMonth" className="block text-gray-700">
            Future Month:
          </label>
          <input
            type="text"
            id="futureMonth"
            value={futureMonth}
            onChange={(e) => setFutureMonth(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="paymentMethod" className="block text-gray-700">
            Payment Method:
          </label>
          <input
            type="text"
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
        </div>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white p-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
