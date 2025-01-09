const ownerModel = require("../models/ownerModel");
const Income = require("../models/Income");
const budgetIncomeModel = require("../models/budgetIncomeModel");
const budgetModel = require("../models/budgetModel");


const createOwnerCtrl = async (req, res) => {
    const {
        propertyData: { name, address, phone, email, unit, categoryId },
    } = req.body;



    const bugdetOwner = await budgetModel.find({serachUpdateId:categoryId})
console.log(bugdetOwner)


if(bugdetOwner){
    const result = await Promise.all(
        bugdetOwner.map(async (owner) => {
          return await budgetIncomeModel.create({
            name: name,
            amount: 0,
            categoryId:owner._id,
          });
        })
      );
}

    try {
        // Validate required fields
        if (!name || !address || !phone || !email || !unit ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Validate unit details
        if (!unit.type || !unit.currency || !unit.fee) {
            return res.status(400).json({
                success: false,
                message: "Unit details (type, currency, fee) are required",
            });
        }

        const generateUnitCode = () => {
            const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
            return randomNumber.toString();  // Convert to string
        };

        const code = generateUnitCode()
        // Create owner entry
        const owner = await ownerModel.create({
            name,
            address,
            phone,
            email,
            unitDetails: unit, // Full unit object
            unit: unit.type, // Only the unit type
            categoryId,
            ownershipTitle : code,
        });

        // Create income entry
        const incomeCreate = await Income.create({
            ownerName: name,
            categoryId,
            contribution: unit.fee,
        });



  
        console.log("Owner and income created successfully");

        // Respond with success
        return res.status(201).json({
            success: true,
            message: "Owner created successfully!",
            data: { owner, incomeCreate },
        });
    } catch (error) {
        console.error("Error in createOwnerCtrl:", error);
        res.status(500).json({
            success: false,
            message: "Error in create owner API",
        });
    }
};


const deleteOwnerCtrl = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProperty = await ownerModel.findByIdAndDelete(id);
        if (!deleteProperty) {
            return res.status(404).json({ success: false, message: "Owner not found" });
        }
        res.status(200).json({
            success: true,
            message: "Owner deleted successfully",
            property: deleteProperty,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const getAllOwnerCtrl = async (req, res) => {
    const { id } = req.params;
    try {
        const properties = await ownerModel.find({ categoryId: id });
        res.json({
            success: true,
            properties,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching owner.",
            error: error.message,
        });
    }
};


const getOwnerCtrl = async (req, res) => {
    try {
        const properties = await ownerModel.find();
        res.json({
            success: true,
            properties,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching owner.",
            error: error.message,
        });
    }
};


















module.exports = {
    createOwnerCtrl,
    deleteOwnerCtrl,
    getAllOwnerCtrl,
    getOwnerCtrl
};
