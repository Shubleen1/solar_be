const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/*
  USER = someone who scanned the QR code and registered
  They get a referralCode → share it → earn commission
*/
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },

    // Auto-generated when they register e.g. "RAHUL-X7K2"
    referralCode: { type: String, unique: true },

    // If this user was referred by someone, store that person's code
    referredBy: { type: String, default: null },

    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Earnings
    totalEarnings: { type: Number, default: 0 }, // commissions already paid
    pendingEarnings: { type: Number, default: 0 }, // commissions approved but not paid yet
    totalLeads: { type: Number, default: 0 }, // how many people used their code

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// ── Before saving: hash the password so it's never stored as plain text ──
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // only hash if password changed
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ── Method to check password on login ──
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }

  next();
});

module.exports = mongoose.model('User', userSchema);
