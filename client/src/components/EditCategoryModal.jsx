import React, { useState } from "react";
import { updateCategoryApi } from "../services/operation/function";

const EditCategoryModal = ({
  category,
  setEditCategory,
  setCategories,
  categories,
}) => {
  const [newName, setNewName] = useState(category.name);

  const handleSaveEdit = async () => {
    if (!newName.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    try {
      const updatedCategory = await updateCategoryApi(category._id, newName);
      setCategories(
        categories.map((cat) =>
          cat._id === updatedCategory._id ? updatedCategory : cat
        )
      );
      setEditCategory(null);
    } catch (error) {
      console.error("Error updating category:", error.message);
    }
  };

  const handleClose = () => {
    setEditCategory(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border p-2 rounded-md w-full mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSaveEdit}
            className="bg-green-500 text-white px-6 py-2 rounded-lg"
          >
            Save Changes
          </button>
          <button
            onClick={handleClose}
            className="bg-red-500 text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
