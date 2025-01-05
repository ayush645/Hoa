const PropertyCommitiModel = require("../models/PropertyCommitiModel");

const createPropertyCommitiCtrl = async (req, res) => {
    const {
        propertyData: { name, position, phone, email, account, currency, categoryId },
    } = req.body;


    try {
        if (!name || !position || !phone || !email || !account || !currency) {
            return res.status(400).json({
                success: false,
                message: "Please Provide All Fields",
            });
        }

        const property = await PropertyCommitiModel.create({
            name, position, phone, email, account, currency, categoryId
        });

        return res.status(201).json({
            success: true,
            message: "Property Committi created successfully!",
            property,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in create category API",
        });
    }
};


const deletePropertyCommitiCtrl = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProperty = await PropertyCommitiModel.findByIdAndDelete(id);
        if (!deleteProperty) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }
        res.status(200).json({
            success: true,
            message: "Property Commiti deleted successfully",
            property: deleteProperty,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const getAllPropertyCommitiCtrl = async (req, res) => {
    const { id } = req.params;
    try {
        const properties = await PropertyCommitiModel.find({ categoryId: id });



        res.json({
            success: true,
            properties,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching property information.",
            error: error.message,
        });
    }
};
const getPropertyCommitiCtrl = async (req, res) => {
    try {
        const properties = await PropertyCommitiModel.find();



        res.json({
            success: true,
            properties,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching property information.",
            error: error.message,
        });
    }
};



















module.exports = {
    createPropertyCommitiCtrl,
    getAllPropertyCommitiCtrl,
    deletePropertyCommitiCtrl,
    getPropertyCommitiCtrl
};
