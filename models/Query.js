const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[0-9]{10}$/, 'Enter valid 10-digit phone number'],
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter valid email'],
      default: '',
    },

    projectType: {
      type: String,
      enum: ['Residential', 'Commercial', 'Industrial'],
      default: 'Residential',
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    status: {
      type: String,
      enum: ['New','Contacted', 'Resolved', 'Closed'],
      default: 'New',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Query', QuerySchema);