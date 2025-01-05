const budgetIncomeModel = require("../models/budgetIncomeModel");

const createBudgetIncomeCtrl = async (req, res) => {
    const {
        propertyData: { name, amount, categoryId },
    } = req.body;


    try {
        if (!name || !amount) {
            return res.status(400).json({
                success: false,
                message: "Please Provide All Fields",
            });
        }


        const property = await budgetIncomeModel.create({
            name, amount, categoryId
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


const deleteBudgetIncomeCtrl = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProperty = await budgetIncomeModel.findByIdAndDelete(id);
        if (!deleteProperty) {
            return res.status(404).json({ success: false, message: "Budget Income not found" });
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



















module.exports = {
    createBudgetIncomeCtrl,
    deleteBudgetIncomeCtrl,
    getAllBudgetIncomeCtrl,
    getBudgetIncomeCtrl
};
