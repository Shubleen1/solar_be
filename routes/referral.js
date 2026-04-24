const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────────
//  GET /api/referral/validate/:code
//  Used on the customer inquiry form to check if code is real
//  No login required
// ─────────────────────────────────────────────
router.get('/validate/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const user = await User.findOne({ referralCode: code });

    if (!user) {
      return res.status(404).json({ valid: false, message: 'This referral code does not exist.' });
    }

    res.json({
      valid: true,
      referrerName: user.name,
      message: `✅ Valid code! Referred by ${user.name}`,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────
//  GET /api/referral/my-code
//  Get the logged-in user's referral code + share link
//  Login required
// ─────────────────────────────────────────────
router.get('/my-code', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.json({
      referralCode: user.referralCode,
      // Full link the user can share (opens register page with their code pre-filled)
      referralLink: `${process.env.FRONTEND_URL}/register?ref=${user.referralCode}`,
      totalLeads: user.totalLeads,
      totalEarnings: user.totalEarnings,
      pendingEarnings: user.pendingEarnings,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
