const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ownershipTitle: {
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
  account: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
  },
 
  uniqueId : {
    type: String,
    required: true,
  },
  unitDetails: {
    type: {
      type: String,
      required: true,
    },
    unitCode: {
      type: String,

    },
    currency: {
      type: String,
  
    },

    fee: {
      type: Number,
   
    },
  },
  paymentType: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
   
  },
},{ timestamps: true });

const owner = mongoose.model("Owner", ownerSchema);

module.exports = owner;
