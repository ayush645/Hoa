const PropertyModel = require("../models/PropertyInformationsModel");
const Category = require("../models/categoryModel");

const createPropertyInformationCtrl = async (req, res) => {
    const {
        propertyData: { pName, pAddress, pLocation, ownerTitle, images, numberOfunits, categoryId,logo },
    } = req.body;


    console.log(logo)

    
    const imagesArray = typeof images === "string" ? JSON.parse(images) : images;

    try {
        if (!pName || !pAddress || !pLocation || !ownerTitle || !images || !numberOfunits || !logo) {
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
            categoryId,
            logo
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


const updatePropertyInformationCtrl = async (req, res) => {
    try {
        const { propertyId } = req.params; // Get the property ID from the request parameters
       
        const {
            pName,
            pAddress,
            pLocation,
            ownerTitle,
            images,
            numberOfunits,
            categoryId,
            logo,
            currency
        } = req.body.propertyData; // Fields to update

   
        // Check if propertyId is provided
        if (!propertyId) {
            return res.status(400).json({
                success: false,
                message: "Property ID is required.",
            });
        }

        // Find the property to update
        const property = await PropertyModel.findById(propertyId);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found.",
            });
        }

        // Parse images if it's a string and it's not empty
        let imagesArray = [];
        if (images && images !== '[]') {
            imagesArray = typeof images === "string" ? JSON.parse(images) : images;
        }

        // Update the property fields (only the ones provided)
        if (pName) property.pName = pName;
        if (currency) property.currency = currency;
        if (pAddress) property.pAddress = pAddress;
        if (pLocation) property.pLocation = pLocation;
        if (ownerTitle) property.ownerTitle = ownerTitle;
        if (imagesArray.length > 0) property.images = imagesArray;
        if (numberOfunits) property.numberOfunits = numberOfunits;
        if (categoryId) property.categoryId = categoryId;
        if (logo) property.logo = logo;

        // Save the updated property
       const propertyDetails = await property.save();
        const catId = propertyDetails.categoryId

        const category = await Category.findByIdAndUpdate(
            catId,
            { name: pName }, // Correctly pass the update data as an object
            { new: true } // Optionally, add `{ new: true }` to return the updated document
        );
        

        // Success response
        return res.status(200).json({
            success: true,
            message: "Property information updated successfully!",
            property,
        });
    } catch (error) {
        console.error("Error updating property information:", error); // Improved error log
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating property information.",
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

const getPropertyById = async(req,res)=>{
    try {
        const {id} = req.params
        const property = await PropertyModel.findById(id)
        return res.status(200).json({
            success: true,
            message: "Property information get successfully!",
            property,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        
    }
}


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
    getPropertyInformationCtrl,
    updatePropertyInformationCtrl,
    getPropertyById
};
