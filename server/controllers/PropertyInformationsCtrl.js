const PropertyModel = require("../models/PropertyInformationsModel");

const createPropertyInformationCtrl = async (req, res) => {
    const {
        propertyData: { pName, pAddress, pLocation, ownerTitle, images, numberOfunits, categoryId },
    } = req.body;

    const imagesArray = typeof images === "string" ? JSON.parse(images) : images;

    try {
        if (!pName || !pAddress || !pLocation || !ownerTitle || !images || !numberOfunits) {
            return res.status(400).json({
                success: false,
                message: "Please Provide All Fields",
            });
        }

        const property = await PropertyModel.create({
            pName,
            pAddress,
            pLocation,
            ownerTitle,
            images: imagesArray,
            numberOfunits,
            categoryId
        });

        return res.status(201).json({
            success: true,
            message: "Property Information created successfully!",
            property,
        });
    } catch (error) {
        console.error(error); // Debugging: Log errors for better diagnosis
        res.status(500).json({
            success: false,
            message: "Error in create category API",
        });
    }
};


const deletePropertyCtrl = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProperty = await PropertyModel.findByIdAndDelete(id);
        if (!deleteProperty) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }
        res.status(200).json({
            success: true,
            message: "Property deleted successfully",
            property: deleteProperty,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



const getAllPropertyInformationCtrl = async (req, res) => {
    const { id } = req.params;
    try {
        const properties = await PropertyModel.find({ categoryId: id });



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


const getPropertyInformationCtrl = async (req, res) => {
    try {
        const properties = await PropertyModel.find();
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
    createPropertyInformationCtrl,
    getAllPropertyInformationCtrl,
    deletePropertyCtrl,
    getPropertyInformationCtrl
};
