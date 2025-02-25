const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetoutcomeSchema = new Schema(
  {
    type: {
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
    date: {
      type: Date,
      default: Date.now(),
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
    },
    updateLog: [
      {
        date: { type: Date, default: Date.now },
        ammount: { type: Number },
        operation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const budgetoutcome = mongoose.model("BudgetOutcome", budgetoutcomeSchema);

module.exports = budgetoutcome;
