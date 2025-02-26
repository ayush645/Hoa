const Unit = require("../models/unitsModel");
const PropertyInfo = require("../models/PropertyInformationsModel");
const PropertyComitte = require("../models/PropertyCommitiModel");
const Owner = require("../models/ownerModel");
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

        // Write file asynchronously
        await fs.promises.writeFile(filePath, JSON.stringify(backupData, null, 2));

        // Check if file exists before sending
        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ message: "Backup file not found" });
        }

        // Set proper headers for file download
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="backup.json"`);
        res.setHeader("Content-Length", fs.statSync(filePath).size);

        // Create a readable stream
        const fileStream = fs.createReadStream(filePath);

        // Pipe stream to response
        fileStream.pipe(res);

        // When stream ends, delete the file
        fileStream.on("end", () => {
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
        });

        // Handle stream errors
        fileStream.on("error", (err) => {
            console.error("File Stream Error:", err);
            res.status(500).json({ message: "Error reading backup file" });
        });

    } catch (err) {
        console.error("Backup Error:", err);
        res.status(500).json({ message: "Error generating backup", error: err.message });
    }
};

module.exports = { backup };
