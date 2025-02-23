const Unit = require("../models/unitsModel");
const PropertyInfo = require("../models/PropertyInformationsModel");
const PropertyComitte = require("../models/PropertyCommitiModel");
const Owner = require("../models/ownerModel"); // Ensure this is correct
const Outcome = require("../models/outcomeModel");
const Income = require("../models/Income");
const Category = require("../models/categoryModel");
const BudgetOutcome = require("../models/budgetOutcomeModel");
const Budget = require("../models/budgetModel");
const BudgetIncome = require("../models/budgetIncomeModel");
const fs = require("fs");
const path = require("path");

const backup = async (req, res) => {
    try {
        // Fetch data with proper variable names
        const unitData = await Unit.find();
        const propertyInfoData = await PropertyInfo.find();
        const propertyComitteData = await PropertyComitte.find();
        const ownerData = await Owner.find();
        const outcomeData = await Outcome.find();
        const incomeData = await Income.find();
        const categoryData = await Category.find();
        const budgetOutcomeData = await BudgetOutcome.find();
        const budgetData = await Budget.find();
        const budgetIncomeData = await BudgetIncome.find();

        // Structure backup data
        const backupData = {
            unitData,
            propertyInfoData,
            propertyComitteData,
            ownerData,
            outcomeData,
            incomeData,
            categoryData,
            budgetOutcomeData,
            budgetData,
            budgetIncomeData,
        };

        const filePath = path.join(__dirname, "backup.json");
        fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

        res.download(filePath, "backup.json", () => {
            fs.unlinkSync(filePath);
        });
    } catch (err) {
        console.error("Backup Error:", err); // Log error to debug
        res.status(500).json({ message: "Error generating backup", error: err.message });
    }
};

module.exports = { backup };
