const ownerModel = require("../models/ownerModel");

const createOwnerCtrl = async (req, res) => {
    const {
        propertyData: { name, address, phone, email, unit, categoryId },
    } = req.body;


    try {
        if (!name || !address || !phone || !email || !unit) {
            return res.status(400).json({
                success: false,
                message: "Please Provide All Fields",
            });
        }

        const property = await ownerModel.create({
            name, address, phone, email, unit, categoryId
        });

        return res.status(201).json({
            success: true,
            message: "Owner created successfully!",
            property,
        });
    } catch (error) {
        console.error(error);
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
