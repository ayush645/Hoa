import React, { useState } from "react";
import { FaEdit, FaTrash, FaTools } from "react-icons/fa";
import EditCategoryModal from "./EditCategoryModal";
import { deleteCategoryApi } from "../services/operation/function";
import { useNavigate } from "react-router-dom"; // Import for navigation

const GetCategory = ({ categories, setCategories }) => {
  const [editCategory, setEditCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      const response = await deleteCategoryApi(id);
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

  const handleManage = (category) => {
    setSelectedCategory(category);
  };

  const closeModal = () => {
    setSelectedCategory(null);
  };

  const handleNavigation = (link) => {
    if (link === "printreports") {
      navigate("/print");
    } else if (selectedCategory) {
      navigate(`/${link}/${selectedCategory._id}`);
    }
  };

  return (
    <div className="p-6 w-full ">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Property Management
      </h1>

      {editCategory && (
        <EditCategoryModal
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
                    <button
                      onClick={() => handleManage(category)}
                      className="text-green-500 hover:text-green-600 text-lg"
                    >
                      Manage
                    </button>
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

      {/* Popup Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4 text-center">
              Manage Category
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                "Property Information",
                "Property Comitee",
                "Property Units",
                "Property Owners",
                "Regular Budget",
                "Exceptional Budget",
                "Print Reports",
                "Upload Documents",
              ].map((link, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleNavigation(link.replace(/\s+/g, "").toLowerCase())
                  }
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center"
                >
                  {link}
                </button>
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-6 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetCategory;
