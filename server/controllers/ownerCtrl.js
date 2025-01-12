const ownerModel = require("../models/ownerModel");
const Income = require("../models/Income");
const budgetIncomeModel = require("../models/budgetIncomeModel");
const budgetModel = require("../models/budgetModel");


const createOwnerCtrl = async (req, res) => {
    const {
        propertyData: { name, address, phone, email, unit, categoryId ,paymentType},
    } = req.body;

console.log(req.body)



    const bugdetOwner = await budgetModel.find({serachUpdateId:categoryId})
console.log(bugdetOwner)




    try {
        // Validate required fields
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }
        
        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Address is required",
            });
        }
        
        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required",
            });
        }
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        
        if (!unit) {
            return res.status(400).json({
                success: false,
                message: "Unit is required",
            });
        }
        

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
            paymentType,
            ownershipTitle : code,
        });

        // Create income entry
        const incomeCreate = await Income.create({
            ownerName: name,
            email: email,
            unit: unit.type,
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

const updateOwnerCtrl = async (req, res) => {
    const ownerId = req.params.id
    const {
      
        propertyData: { name, address, phone, email, unit, categoryId,paymentType },
    } = req.body;

   console.log(req.body)
    try {
        // Validate required fields
        if (!ownerId) {
            return res.status(400).json({
                success: false,
                message: "Owner ID is required for updating.",
            });
        }

        // Validate unit details
        if (unit && (!unit.type || !unit.currency || !unit.fee)) {
            return res.status(400).json({
                success: false,
                message: "Unit details (type, currency, fee) are required if unit is provided.",
            });
        }

        // Find the owner by ID
        const existingOwner = await ownerModel.findById(ownerId);
        if (!existingOwner) {
            return res.status(404).json({
                success: false,
                message: "Owner not found.",
            });
        }

        // Update fields if provided
        if (name) existingOwner.name = name;
        if (address) existingOwner.address = address;
        if (phone) existingOwner.phone = phone;
        if (email) existingOwner.email = email;
        if (paymentType) existingOwner.paymentType = paymentType;
        if (unit) {
            existingOwner.unitDetails = unit; // Full unit object
            existingOwner.unit = unit.type; // Only the unit type
        }
        if (categoryId) existingOwner.categoryId = categoryId;

        // Save the updated owner
        const updatedOwner = await existingOwner.save();


     
        
        // Update income entry
        const updatedIncome = await Income.findOneAndUpdate(
            {
                ownerName: existingOwner.name, // Ensure `existingOwner.name` is correct
                categoryId: existingOwner.categoryId, // Ensure type matches
            },
            {
                $set: {
                    ownerName: name, // Replace with the new name
                    email: email, // Replace with the new name
                    email: email,
                    unit: unit.type,
                    contribution: unit ? unit.fee : existingOwner.unitDetails.fee, // Update contribution
                },
            },
            {
                new: true, // Return the updated document
                upsert: false, // Do not create a new document if none matches
            }
        );
        
        if (!updatedIncome) {
            console.log("No document matched the query. Check database or query conditions.");
        } else {
            console.log("Updated Income:", updatedIncome);
        }
        
        
        // Update `budgetIncomeModel` entries
        const budgetOwners = await budgetModel.find({ serachUpdateId: categoryId });

        if (budgetOwners) {
            await Promise.all(
                budgetOwners.map(async (owner) => {
                    const budgetIncome = await budgetIncomeModel.findOne({ categoryId: owner._id });
                    if (budgetIncome) {
                        budgetIncome.name = name; // Update the name if it exists
                        await budgetIncome.save();
                    } else {
                        // Create new entry if it doesn't exist
                        await budgetIncomeModel.create({
                            name: name,
                            amount: 0,
                            categoryId: owner._id,
                        });
                    }
                })
            );
        }

        console.log("Owner, income, and budget income updated successfully");

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "Owner updated successfully!",
            data: { updatedOwner, updatedIncome },
        });
    } catch (error) {
        console.error("Error in updateOwnerCtrl:", error);
        res.status(500).json({
            success: false,
            message: "Error in update owner API",
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
    getOwnerCtrl,
    updateOwnerCtrl
};
