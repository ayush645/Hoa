const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const budget = mongoose.model('Budget', budgetSchema);

module.exports = budget;
