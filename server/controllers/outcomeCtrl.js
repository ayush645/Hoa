const outcomeModle = require("../models/outcomeModel");

const createOutComeCtrl = async (req, res) => {
    const { propertyData } = req.body; // Extract propertyData
    const { expense, months = {}, categoryId } = propertyData || {}; // Destructure from propertyData


    try {
        // Validate required fields
        if (!expense || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "Both `expense` and `categoryId` are required.",
            });
        }

        // Calculate totalAmount from months
        const totalAmount = Object.values(months).reduce(
            (acc, curr) => acc + (curr || 0),
            0
        );

        // Create the outcome entry
        const outcome = await outcomeModle.create({
            expense,
            months,
            totalAmount,
            categoryId,
        });

        // Respond with success
        return res.status(201).json({
            success: true,
            message: "Outcome created successfully!",
            outcome,
        });
    } catch (error) {
        console.error("Error creating outcome:", error);
        res.status(500).json({
            success: false,
            message: "Error in create outcome API",
            error: error.message,
        });
    }
};



const deleteOutcomeCtrl = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProperty = await outcomeModle.findByIdAndDelete(id);
        if (!deleteProperty) {
            return res.status(404).json({ success: false, message: "Outcome not found" });
        }
        res.status(200).json({
            success: true,
            message: "Outcome deleted successfully",
            property: deleteProperty,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const getAllOutcomeCtrl = async (req, res) => {
    const { id } = req.params;
    try {
        const properties = await outcomeModle.find({ categoryId: id });
        res.json({
            success: true,
            properties,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching property outcome.",
            error: error.message,
        });
    }
};
const getOutcomeCtrl = async (req, res) => {
    try {
        const properties = await outcomeModle.find();
        res.json({
            success: true,
            properties,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching property outcome.",
            error: error.message,
        });
    }
};





const updateMonthsOutcome = async (req, res) => {
    const { id } = req.params;
    const { month, amount } = req.body;
    console.log(req.body);
    // Validate input
    if (!month || typeof amount !== 'number') {
        return res.status(400).json({ message: "Month and amount are required and amount should be a number" });
    }

    const validMonths = [
        "January", "February", "March", "April", "May",
        "June", "July", "August", "September",
        "October", "November", "December"
    ];

    if (!validMonths.includes(month)) {
        return res.status(400).json({ message: "Invalid month" });
    }

    try {
        const updatedIncome = await outcomeModle.findByIdAndUpdate(
            id,
            { $set: { [`months.${month}`]: amount } },
            { new: true, runValidators: true }
        );

        if (!updatedIncome) {
            return res.status(404).json({ message: "Outcome record not found" });
        }

        updatedIncome.totalAmount = Object.values(updatedIncome.months).reduce((acc, curr) => acc + curr, 0);
        await updatedIncome.save();

        res.status(200).json({ message: "Month updated successfully", data: updatedIncome });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
}













module.exports = {
    createOutComeCtrl,
    deleteOutcomeCtrl,
    getAllOutcomeCtrl,
    getOutcomeCtrl,
    updateMonthsOutcome
};
