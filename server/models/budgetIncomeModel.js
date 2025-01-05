const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetIncomeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },


    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Budget",
        required: true,
    },
}, { timestamps: true });

const budgetincome = mongoose.model(
    "BudgetIncome",
    budgetIncomeSchema
);

module.exports = budgetincome;
