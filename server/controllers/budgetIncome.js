const budgetIncomeModel = require("../models/budgetIncomeModel");
const Outcome = require("../models/budgetOutcomeModel");

const createBudgetIncomeCtrl = async (req, res) => {
  const {
    propertyData: { name, amount, categoryId, document },
  } = req.body;

  try {
    if (!name || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    const property = await budgetIncomeModel.create({
      name,
      amount,
      categoryId,
      document,
      updateLog: [
        {
          date: Date.now(),
          amount: amount,
          operation: `${name} Budget Income`,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Budget Income created successfully!",
      property,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in create budget income API",
    });
  }
};

const updateBudgetIncomeCtrl = async (req, res) => {
  const { id } = req.params; // Get the ID from the URL params
  const {
    propertyData: { name, amount, document },
  } = req.body;

  try {
    // Check if all required fields are provided
    if (!name || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    // Find the property by ID
    const property = await budgetIncomeModel.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Update the fields
    property.name = name;
    property.amount = amount;
    property.document = document;

    // Find if there's already a log with the same month/operation
    const existingLogIndex = property.updateLog.findIndex(log =>
      log.operation && log.operation.includes(`${name} Budget Income updated`) // Check if log.operation exists

    );
console.log(existingLogIndex)
    if (existingLogIndex !== -1) {
      // If log entry exists, update it
      property.updateLog[existingLogIndex] = {
        ...property.updateLog[existingLogIndex],
        date: Date.now(), // Update the date to the current time
        ammount: amount,  // Update the amount if necessary
        operation:`${name} Budget Income updated`
      };
    } else {
      // If no log entry is found, create a new one
      property.updateLog.push({
        date: Date.now(),
        ammount: amount,
        operation: `${name} Budget Income updated`,
      });
    }

    // Save the updated property
    await property.save();

    return res.status(200).json({
      success: true,
      message: "Budget Income updated successfully!",
      property,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in updating budget income API",
    });
  }
};



const deleteBudgetIncomeCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProperty = await budgetIncomeModel.findByIdAndDelete(id);
    if (!deleteProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Budget Income not found" });
    }
    res.status(200).json({
      success: true,
      message: "Budget Income deleted successfully",
      property: deleteProperty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBudgetIncomeCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    const properties = await budgetIncomeModel.find({ categoryId: id });
    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching budget income .",
      error: error.message,
    });
  }
};
const getBudgetIncomeCtrl = async (req, res) => {
  try {
    const properties = await budgetIncomeModel.find();
    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching budget income .",
      error: error.message,
    });
  }
};

const getBudgetDataCtrl = async (req, res) => {
  try {
    // Fetch data from both models
    const budgetIncomeData = await budgetIncomeModel.find();
    const budgetOutcomeData = await Outcome.find();

    // Return both data in a single response
    return res.status(200).json({
      success: true,
      message: "Budget data fetched successfully",
      data: {
        income: budgetIncomeData,
        outcome: budgetOutcomeData,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching budget data",
    });
  }
};

module.exports = {
  createBudgetIncomeCtrl,
  deleteBudgetIncomeCtrl,
  getAllBudgetIncomeCtrl,
  getBudgetIncomeCtrl,
  getBudgetDataCtrl,
  updateBudgetIncomeCtrl
};
