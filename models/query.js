const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      default: ''
    },
    projectType: {
      type: String,
      default: 'Residential'
    },
    message: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Query', QuerySchema);