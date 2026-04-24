const mongoose = require('mongoose');

/*
  LEAD = a new customer who wants to install solar
  They came because someone shared a referral code with them
*/
const leadSchema = new mongoose.Schema(
  {
    // ── Customer Info ──────────────────────────────────
    customerName:  { type: String, required: true },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, required: true },
    customerCity:  { type: String, required: true },
    propertyType:  {
      type: String,
      enum: ['home', 'business', 'farm', 'other'],
      default: 'home'
    },
    message: { type: String, default: '' }, // any message from customer

    // ── Referral Info ───────────────────────────────────
    referralCode: { type: String, required: true },           // code customer entered
    referrerId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who gets commission

    // ── Project Info (filled by admin) ─────────────────
    projectValue: { type: Number, default: 0 }, // e.g. ₹1,50,000
    projectStatus: {
      type: String,
      enum: ['pending', 'contacted', 'site_visit', 'approved', 'installed', 'cancelled'],
      default: 'pending'
    },
    /*
      Status flow:
      pending → contacted → site_visit → approved → installed
                                                   ↘ cancelled
    */

    // ── Commission ─────────────────────────────────────
    commissionPercent: { type: Number, default: 5 },    // % of project value
    commissionAmount:  { type: Number, default: 0 },    // calculated ₹ amount
    commissionStatus:  {
      type: String,
      enum: ['pending', 'approved', 'paid'],
      default: 'pending'
    },
    paidAt: { type: Date, default: null },

    // ── Admin Notes ────────────────────────────────────
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
