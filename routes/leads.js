const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const User = require('../models/User');
const { sendEmail, newLeadEmail } = require('../utils/sendEmail');

// ─────────────────────────────────────────────
//  POST /api/leads/submit
//  A new customer submits solar inquiry with a referral code
//  No login required (anyone can submit)
// ─────────────────────────────────────────────
router.post('/submit', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerCity,
      propertyType,
      message,
      referralCode,
    } = req.body;

    // 1. Validate required fields
    if (!customerName || !customerPhone || !customerCity || !referralCode) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // 2. Find who owns this referral code
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (!referrer) {
      return res.status(400).json({ message: 'Invalid referral code. Please check and try again.' });
    }

    // 3. Prevent duplicate submission (same phone + same referral code)
    const duplicate = await Lead.findOne({
      customerPhone,
      referralCode: referralCode.toUpperCase(),
    });
    if (duplicate) {
      return res.status(400).json({
        message: 'This phone number already submitted an inquiry with this code.',
      });
    }

    // 4. Create the lead
    const lead = await Lead.create({
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      customerCity,
      propertyType: propertyType || 'home',
      message: message || '',
      referralCode: referralCode.toUpperCase(),
      referrerId: referrer._id,
      commissionPercent: Number(process.env.COMMISSION_PERCENT) || 5,
    });

    // 5. Update referrer's lead count
    await User.findByIdAndUpdate(referrer._id, { $inc: { totalLeads: 1 } });

    // 6. Email the referrer to tell them someone used their code
    const emailTemplate = newLeadEmail(referrer.name, customerName, customerCity);
    await sendEmail({ to: referrer.email, ...emailTemplate });

    res.status(201).json({
      message: '✅ Inquiry submitted successfully! Our team will contact you within 24 hours.',
      leadId: lead._id,
    });
  } catch (err) {
    console.error('Lead submit error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
