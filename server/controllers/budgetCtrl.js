const budgetModel = require("../models/budgetModel");
const budgetIncomeModel = require("../models/budgetIncomeModel")
const budgetOutcomeModel = require("../models/budgetOutcomeModel")

const createbudget = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = new budgetModel({
      name,

    });
    await newCategory.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Budget created successfully",
        category: newCategory,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in create budget api" });
  }
};


const deletebudget = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await budgetModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }
    const modelsToUpdate = [
      budgetIncomeModel,
      budgetOutcomeModel
    ];

    await Promise.all(
      modelsToUpdate.map((model) =>
        model.updateMany(
          { categoryId: id },
          { $unset: { categoryId: "" } }
        )
      )
    );

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getAllbudgets = async (req, res) => {
  try {
    const categories = await budgetModel.find();
    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateBudgetCtrl = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await budgetModel.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "budget not found" });
    }

    return res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating budget:", error);
    return res.status(500).json({ message: "Error updating budget" });
  }

};

















module.exports = {
  createbudget,
  deletebudget,
  getAllbudgets,
  updateBudgetCtrl
};
