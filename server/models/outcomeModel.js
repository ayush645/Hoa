const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const outcomeSchema = new Schema({
    expense: {
        type: String,
        required: true,
    },
    months: {
        January: { type: Number, default: 0 },
        February: { type: Number, default: 0 },
        March: { type: Number, default: 0 },
        April: { type: Number, default: 0 },
        May: { type: Number, default: 0 },
        June: { type: Number, default: 0 },
        July: { type: Number, default: 0 },
        August: { type: Number, default: 0 },
        September: { type: Number, default: 0 },
        October: { type: Number, default: 0 },
        November: { type: Number, default: 0 },
        December: { type: Number, default: 0 },
    },
    totalAmount: {
        type: Number,
        default: 0,
    },

    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
}, { timestamps: true });

outcomeSchema.pre('save', function (next) {
    const months = this.months;
    this.totalAmount = Object.values(months).reduce((acc, curr) => acc + curr, 0);
    next();
});

const outcome = mongoose.model(
    "Outcome",
    outcomeSchema
);

module.exports = outcome;



