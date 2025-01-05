const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UnitsSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    fee: {
        type: String,
        required: true,
    },

    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
});

const units = mongoose.model(
    "Units",
    UnitsSchema
);

module.exports = units;
