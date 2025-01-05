import React, { useState } from "react";
import { FaEdit, FaTrash, FaTools } from "react-icons/fa";
import EditBudgetModel from "./EditBudgetModel";
import { deleteBudgetApi } from "../services/operation/function";
import { Link, useNavigate } from "react-router-dom"; // Import for navigation

const GetBudget = ({ categories, setCategories }) => {
  const [editCategory, setEditCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      const response = await deleteBudgetApi(id);
      if (response) {
        setCategories(categories.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting category:", error.message);
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
  };

  const closeModal = () => {
    setSelectedCategory(null);
  };

  const handleNavigation = (link) => {
    if (selectedCategory) {
      navigate(`/${link}/${selectedCategory._id}`);
    }
  };

  return (
    <div className="p-6 w-full ">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Property Management
      </h1>

      {editCategory && (
        <EditBudgetModel
          category={editCategory}
          setEditCategory={setEditCategory}
          setCategories={setCategories}
          categories={categories}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">
                #
              </th>
              <th className="px-6 py-3 text-left text-gray-600 font-semibold">
                Property Name
              </th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr
                  key={category._id}
                  className="border-b last:border-none hover:bg-gray-100"
                >
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{category.name}</td>
                  <td className="px-6 py-3 text-center flex justify-center space-x-4">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-500 hover:text-blue-600 text-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-500 hover:text-red-600 text-lg"
                    >
                      <FaTrash />
                    </button>
                    <Link to={`/exceptionalbudget/income/${category._id}`}>
                      Incomes
                    </Link>
                    <Link to={`/exceptionalbudget/outcome/${category._id}`}>
                      OutComes
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-3 text-center text-gray-500">
                  No categories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetBudget;
