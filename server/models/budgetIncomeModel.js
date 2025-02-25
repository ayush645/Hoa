const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetIncomeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },

    document: {
      public_id: String,
      url: String,
    },

    uniqueId: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
    },
    status: {
      type: String,
      default:"Not Updated"
    },

    updateLog: [
      {
        date: { type: Date },
        ammount: { type: Number },

        operation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const budgetincome = mongoose.model("BudgetIncome", budgetIncomeSchema);

module.exports = budgetincome;
