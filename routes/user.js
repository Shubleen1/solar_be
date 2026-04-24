const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// All routes here require login
router.use(protect);

// ─────────────────────────────────────────────
//  GET /api/user/dashboard
//  Returns everything needed for the user's dashboard
// ─────────────────────────────────────────────
router.get('/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    // Get all leads that came through this user's referral code
    const leads = await Lead.find({ referrerId: req.user._id }).sort({ createdAt: -1 });

    // Calculate stats
    const stats = {
      totalLeads:      leads.length,
      pendingLeads:    leads.filter(l => l.projectStatus === 'pending').length,
      installedLeads:  leads.filter(l => l.projectStatus === 'installed').length,
      cancelledLeads:  leads.filter(l => l.projectStatus === 'cancelled').length,
      totalEarnings:   user.totalEarnings,
      pendingEarnings: user.pendingEarnings,
    };

    res.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        referralCode: user.referralCode,
        referralLink: `${process.env.FRONTEND_URL}/register?ref=${user.referralCode}`,
      },
      stats,
      leads, // full list of leads for the table
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────
//  GET /api/user/profile
// ─────────────────────────────────────────────
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
