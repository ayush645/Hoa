import React, { useState, useEffect } from "react";
import { FaCopy, FaTrash } from "react-icons/fa";
import EditCategoryModal from "./EditCategoryModal";
import {
  deleteCategoryApi,
  duplicateCategoryApi,
} from "../services/operation/function";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IoDuplicateOutline } from "react-icons/io5";

const GetCategory = ({ categories, setCategories, fetchCategories }) => {
  const [editCategory, setEditCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const navigate = useNavigate();

  // Load selected category from sessionStorage on component mount
  useEffect(() => {
    const savedCategoryId = sessionStorage.getItem("selectedCategoryId");
    if (savedCategoryId) {
      setSelectedCategoryId(savedCategoryId);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await deleteCategoryApi(id);
        if (response) {
          fetchCategories();
          setCategories(categories.filter((item) => item._id !== id));
          Swal.fire("Deleted!", "Your Property has been deleted.", "success");
        }
      }
    } catch (error) {
      console.error("Error deleting Property:", error.message);
      Swal.fire("Error!", "Failed to delete the Property.", "error");
    }
  };

  const handleManage = (id) => {
    const newSelectedId = selectedCategoryId === id ? null : id;
    setSelectedCategoryId(newSelectedId);

    // Save the new selected category ID to sessionStorage
    if (newSelectedId) {
      sessionStorage.setItem("selectedCategoryId", newSelectedId);
    } else {
      sessionStorage.removeItem("selectedCategoryId");
    }
  };

  const handleNavigation = (link, id) => {
    if (link === "printreports") {
      navigate(`/print/${id}`);
    } else {
      navigate(`/${link}/${id}`);
    }
  };

  const handleDuplicate = async (categoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to duplicate this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, duplicate it!",
    }).then(async (result) => {
      // ✅ Make this function async
      if (result.isConfirmed) {
        try {
          console.log("Duplicating category with ID:", categoryId);
          await duplicateCategoryApi(categoryId);
          fetchCategories();
        } catch (error) {
          console.error("Error duplicating category:", error);
        }
      }
    });
  };

  return (
    <div className="p-6 w-full ">
    {/* <h1 className="text-2xl font-bold text-white mb-6 text-center">
      Property Management
    </h1> */}

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
              <React.Fragment key={category._id}>
                <tr className="border-b last:border-none hover:bg-gray-100">
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{category.name}</td>
                  <td className="px-6 py-3 text-center flex justify-center space-x-4">
                  
                 
                    <button
                      onClick={() => handleManage(category._id)}
                      className="text-green-500 hover:text-green-600 text-lg"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => handleDuplicate(category._id)}
                      className="text-gray-500 hover:text-gray-600 text-lg"
                    >
                      <FaCopy />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-500 hover:text-red-600 text-lg"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
                {selectedCategoryId === category._id && (
                  <tr>
                    <td colSpan="3" className="px-6 py-3">
                      <div className="flex space-x-4 justify-center">
                        {[
                          "Property Information",
                          "Property Units",
                          "Property Owners",
                          "Property Comitee",
                          "Regular Budget",
                          "Exceptional Budget",
                          "Print Reports",
                          "Upload Documents",
              
              
              
                        ].map((link, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleNavigation(
                                link.replace(/\s+/g, "").toLowerCase(),
                                category._id
                              )
                            }
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                          >
                            {link}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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

export default GetCategory;
