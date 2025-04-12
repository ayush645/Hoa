import React, { useEffect, useState } from "react";
import {
  createBudgetApi,
  getAllBudgetApi,
} from "../services/operation/function";
import GetBudget from "../components/GetBudget";
import { useParams,useNavigate } from "react-router-dom";

const Budget = () => {
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
 const {id} = useParams()
 const navigate = useNavigate();
 const [selectedYear, setSelectedYear] = useState("");
  const fetchBudget = async () => {
 
    try {
      const categoryList = await getAllBudgetApi(id);
      setCategories(categoryList || []);
      console.log(categoryList)
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const handleCreateCategory = async () => {
    if (!name.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    try {
      const response = await createBudgetApi({name,id});
      if (response) {
        setName("");
        setShowForm(false);
        fetchBudget();
      }
    } catch (error) {
      console.error("Error creating category:", error.message);
    }
  };
  useEffect(() => {
    fetchBudget();
  }, []);

  return (
    <div className="category-page flex flex-col items-center p-6">
      <button
  onClick={() => navigate("/")}
  className="button-85"

  style={{ right: '664px', top: '44px' }}
>
  Go to Home
</button>

<div className="mb-4 flex justify-center">
        <label htmlFor="year" className="mr-2 text-white mt-2">
          Filter by Year:
        </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">All</option>
          {categories
            .map((property) => new Date(property.createdAt).getFullYear())
            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
      </div>
      {!selectedYear && (
        <div className="flex justify-center items-center mt-5">
          <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-lg shadow-lg max-w-md text-center">
            <p className="font-semibold text-lg">Please select a year.</p>
          </div>
        </div>
      )}

   { selectedYear &&   <GetBudget categories={categories} setCategories={setCategories} />}


      <div>
      <button
        className="button-85"
        // className={`${
        //   showForm ? "bg-red-500" : "bg-blue-500"
        // } text-white px-6 py-2 rounded-lg mb-6 hover:opacity-90`}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Budget "}
      </button>
      

      <br />
      {showForm && (
        <div className="form bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-7xl">
          <input
            type="text"
            placeholder="Enter Property Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full mb-4 rounded-lg"
          />
          <div className="flex justify-center items-center">
            <button
              onClick={handleCreateCategory}
              // className="bg-green-500 text-white px-6 py-2 rounded-lg w-full hover:bg-green-600"
              className="button-85"
            >
              Create Budget
              
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Budget;
