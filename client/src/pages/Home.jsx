import React, { useEffect, useState } from "react";
import {
  createCategoryApi,
  getAllCategoryApi,
} from "../services/operation/function";
import GetCategory from "../components/GetCategory";

const Home = () => {
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const categoryList = await getAllCategoryApi();
      setCategories(categoryList || []);
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
      const response = await createCategoryApi(name);
      if (response) {
        setName("");
        setShowForm(false);
        fetchCategories();
      }
    } catch (error) {
      console.error("Error creating category:", error.message);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-page flex flex-col items-center p-6">
      <button
        className="button-85"
        // className={`${
        //   showForm ? "bg-red-500" : "bg-blue-500"
        // } text-white px-6 py-2 rounded-lg mb-6 hover:opacity-90`}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Property "}
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
              Create Property
            </button>
          </div>
        </div>
      )}

      <GetCategory categories={categories} setCategories={setCategories} />
    </div>
  );
};

export default Home;
