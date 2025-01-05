const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },

    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
});

const owner = mongoose.model(
    "Owner",
    ownerSchema
);

module.exports = owner;
