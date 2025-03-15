const Category = require("../models/categoryModel");
const unitModel = require("../models/unitsModel")
const piModel = require("../models/PropertyInformationsModel")
const pcmodel = require("../models/PropertyCommitiModel")
const ownerModel = require("../models/ownerModel")
const outcomeModel = require("../models/outcomeModel")
const incomeModel = require("../models/Income");
const budgetModel = require("../models/budgetModel");
const PropertyModel = require("../models/PropertyInformationsModel");

const mongoose = require("mongoose");

const createCategory = async (req, res) => {
  const { name } = req.body;

  console.log("this")

  
  try {
    const newCategory = new Category({
      name,

    });
    const property = new PropertyModel({
      pName: name,
      categoryId:newCategory._id

    });

    await property.save();
    await newCategory.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Category created successfully",
        category: newCategory,
      });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Error in create category api" });
  }
};


const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (deleteCategory) {
      await unitModel.deleteMany({ categoryId: new mongoose.Types.ObjectId(id) });
      await piModel.deleteMany({ categoryId: new mongoose.Types.ObjectId(id) });
      await pcmodel.deleteMany({ categoryId: new mongoose.Types.ObjectId(id) });
      await ownerModel.deleteMany({ categoryId: new mongoose.Types.ObjectId(id) });
      await outcomeModel.deleteMany({ categoryId: new mongoose.Types.ObjectId(id) });
      await incomeModel.deleteMany({ categoryId: new mongoose.Types.ObjectId(id) });
      await budgetModel.deleteMany({ categoryId: new mongoose.Types.ObjectId(id) });
    }
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};


const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateCategoryCtrl = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Error updating category" });
  }

};


const duplicateCategory = async (req, res) => {
  const { categoryId } = req.params;
console.log(categoryId)
  if (!categoryId) {
    return res.status(400).json({ success: false, message: "Category ID is required" });
  }

  try {
    const categoryDetails = await Category.findById(categoryId);
    console.log(categoryDetails)
    if (!categoryDetails) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Check if a duplicate already exists to prevent infinite duplication
    const existingDuplicate = await Category.findOne({ name: `${categoryDetails.name}-Duplicate` });
    if (existingDuplicate) {
      return res.status(400).json({ success: false, message: "Duplicate category already exists" });
    }

    // Create a new category and associated property
    const newCategory = new Category({
      name: `${categoryDetails.name}-Duplicate`,
    });

    const property = new PropertyModel({
      pName: `${categoryDetails.name}-Duplicate`,
      categoryId: newCategory._id,
    });

    await newCategory.save();
    await property.save();

    res.status(201).json({
      success: true,
      message: "Category duplicated successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error in duplicateCategory API:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};















module.exports = {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategoryCtrl,
  duplicateCategory
};
