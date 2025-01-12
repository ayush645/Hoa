const budgetoutcomeModle = require("../models/budgetOutcomeModel");

const createbudgetOutComeCtrl = async (req, res) => {
  const {
    propertyData: { type, amount, categoryId, document },
  } = req.body;

  console.log(document)
  
  try {
    if (!type || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    const property = await budgetoutcomeModle.create({
      type,
      amount,
      categoryId,
      document,
      updateLog: [
        {
          date: Date.now(),
          ammount:amount,
          operation: `${type} - Expense`,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Budget Outcome created successfully!",
      property,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in create budget outcome API",
    });
  }
};


const updateBudgetOutcomeCtrl = async (req, res) => {
  const { id } = req.params; // Get the ID from the URL params
  const {
    propertyData: { type, amount,  document },
  } = req.body;

  

  try {
    // Check if all required fields are provided
    if (!type || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    // Find the property by ID and update it
    const property = await budgetoutcomeModle.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }


    // Find the existing updateLog entry (if it exists)
    const existingLogIndex = property.updateLog.findIndex(log =>
      log.operation && log.operation.includes(`${type} - Expense updated`) // Check if log.operation exists

    );
    console.log(existingLogIndex)
    if (existingLogIndex !== -1) {
      // If log entry exists, update it
      console.log("enter")
      property.updateLog[existingLogIndex] = {
        ...property.updateLog[existingLogIndex],
        date: Date.now(), // Update the date to the current time
        ammount: amount,  // Update the amount if necessary
        operation:`${type} - Expense updated`
      };
    } else {
      // If no existing log entry found, create a new one
      console.log("enter2")

      property.updateLog.push({
        date: Date.now(),
        ammount: amount,
        operation: `${type} - Expense updated`,
      });
    }

    // Update the fields
    property.type = type;
    property.amount = amount;
      property.document = document;

    // Save the updated property
    await property.save();

    return res.status(200).json({
      success: true,
      message: "Budget Outcome updated successfully!",
      property,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in updating budget outcome API",
    });
  }
};




const deletebudOutcomeCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProperty = await budgetoutcomeModle.findByIdAndDelete(id);
    if (!deleteProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Outcome not found" });
    }
    res.status(200).json({
      success: true,
      message: " Budget Outcome deleted successfully",
      property: deleteProperty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBudgetOutcomeCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    const properties = await budgetoutcomeModle.find({ categoryId: id });
    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching budget outcome.",
      error: error.message,
    });
  }
};
const getBudgetOutcomeCtrl = async (req, res) => {
  try {
    const properties = await budgetoutcomeModle.find();
    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching budget outcome.",
      error: error.message,
    });
  }
};



module.exports = {
  createbudgetOutComeCtrl,
  deletebudOutcomeCtrl,
  getAllBudgetOutcomeCtrl,
  getBudgetOutcomeCtrl,
  updateBudgetOutcomeCtrl
};
