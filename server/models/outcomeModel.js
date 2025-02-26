const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const outcomeSchema = new Schema(
  {
    expense: {
      type: String,
   
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

    document: {
      public_id: String,
      url: String,
    },

    documents: [
        {
          date: { type: Date, default: Date.now }, // Fix: Proper default Date

          month: { type: String, required: true }, // Store month name
          url: String,
        },
      ],


    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    updateLog: [
      {
        date: { type: Date, default: Date.now },
        updatedFields: { type: Map, of: String }, // Logs changed fields and their values
        operation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

outcomeSchema.pre("save", function (next) {
  const months = this.months;
  this.totalAmount = Object.values(months).reduce((acc, curr) => acc + curr, 0);
  next();
});




outcomeSchema.pre("updateOne", function (next) {
  const update = this.getUpdate();

  if (update.$set || update.$inc) {
    const logEntry = {
      date: new Date(),
      updatedFields: new Map(Object.entries(update.$set || {})),
    };

    // Push the log entry into updateLog
    this.update({}, { $push: { updateLog: logEntry } });
  }
  next();
});
const outcome = mongoose.model("Outcome", outcomeSchema);

module.exports = outcome;
