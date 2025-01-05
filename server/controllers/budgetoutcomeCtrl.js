const budgetoutcomeModle = require("../models/budgetOutcomeModel");

const createbudgetOutComeCtrl = async (req, res) => {
    const {
        propertyData: { type, amount, categoryId },
    } = req.body;


    try {
        if (!type || !amount) {
            return res.status(400).json({
                success: false,
                message: "Please Provide All Fields",
            });
        }


        const property = await budgetoutcomeModle.create({
            type, amount, categoryId
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


const deletebudOutcomeCtrl = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProperty = await budgetoutcomeModle.findByIdAndDelete(id);
        if (!deleteProperty) {
            return res.status(404).json({ success: false, message: "Outcome not found" });
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
    getBudgetOutcomeCtrl
};
