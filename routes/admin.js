const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { sendEmail, commissionEmail } = require('../utils/sendEmail');

// Every admin route requires: logged in + role = 'admin'
router.use(protect, adminOnly);

// ─────────────────────────────────────────────
//  GET /api/admin/stats
//  Overview numbers for admin dashboard
// ─────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const totalLeads     = await Lead.countDocuments();
    const pendingLeads   = await Lead.countDocuments({ projectStatus: 'pending' });
    const installedLeads = await Lead.countDocuments({ projectStatus: 'installed' });
    const totalUsers     = await User.countDocuments({ role: 'user' });

    // Sum up commission amounts
    const pendingPayout = await Lead.aggregate([
      { $match: { commissionStatus: 'approved' } },
      { $group: { _id: null, total: { $sum: '$commissionAmount' } } },
    ]);
    const paidPayout = await Lead.aggregate([
      { $match: { commissionStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$commissionAmount' } } },
    ]);

    res.json({
      totalLeads,
      pendingLeads,
      installedLeads,
      totalUsers,
      pendingPayout: pendingPayout[0]?.total || 0,
      paidPayout:    paidPayout[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────
//  GET /api/admin/leads
//  Get all leads (with optional status filter + pagination)
// ─────────────────────────────────────────────
router.get('/leads', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { projectStatus: status } : {};

    const leads = await Lead.find(filter)
      .populate('referrerId', 'name email phone referralCode') // attach referrer info
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Lead.countDocuments(filter);

    res.json({
      leads,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────
//  PUT /api/admin/leads/:id
//  Update lead status and set project value
//  This triggers commission when status = 'installed'
// ─────────────────────────────────────────────
router.put('/leads/:id', async (req, res) => {
  try {
    const { projectStatus, projectValue, adminNotes } = req.body;

    const lead = await Lead.findById(req.params.id).populate('referrerId');
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // Update status and notes
    if (projectStatus) lead.projectStatus = projectStatus;
    if (adminNotes !== undefined) lead.adminNotes = adminNotes;

    // If project value is set, calculate commission
    if (projectValue && Number(projectValue) > 0) {
      lead.projectValue     = Number(projectValue);
      lead.commissionAmount = (Number(projectValue) * lead.commissionPercent) / 100;
      // e.g. ₹1,50,000 × 5% = ₹7,500
    }

    // When project is INSTALLED → approve the commission automatically
    if (projectStatus === 'installed' && lead.commissionAmount > 0) {
      lead.commissionStatus = 'approved';

      // Add to referrer's pending earnings
      await User.findByIdAndUpdate(lead.referrerId._id, {
        $inc: { pendingEarnings: lead.commissionAmount },
      });

      // Email the referrer
      const emailTemplate = commissionEmail(
        lead.referrerId.name,
        lead.commissionAmount,
        'approved'
      );
      await sendEmail({ to: lead.referrerId.email, ...emailTemplate });
    }

    // When cancelled → no commission
    if (projectStatus === 'cancelled') {
      lead.commissionStatus = 'pending'; // reset if it was approved before
    }

    await lead.save();
    res.json({ message: '✅ Lead updated successfully', lead });
  } catch (err) {
    console.error('Admin update lead error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────
//  PUT /api/admin/leads/:id/pay
//  Mark commission as PAID (after you transfer money to referrer)
// ─────────────────────────────────────────────
router.put('/leads/:id/pay', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('referrerId');
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    if (lead.commissionStatus !== 'approved') {
      return res.status(400).json({
        message: 'Commission must be approved before marking as paid.',
      });
    }

    lead.commissionStatus = 'paid';
    lead.paidAt = new Date();
    await lead.save();

    // Move money from pendingEarnings → totalEarnings
    await User.findByIdAndUpdate(lead.referrerId._id, {
      $inc: {
        totalEarnings:   lead.commissionAmount,
        pendingEarnings: -lead.commissionAmount,
      },
    });

    // Email the referrer that they've been paid
    const emailTemplate = commissionEmail(lead.referrerId.name, lead.commissionAmount, 'paid');
    await sendEmail({ to: lead.referrerId.email, ...emailTemplate });

    res.json({ message: '✅ Commission marked as paid!', lead });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────
//  GET /api/admin/users
//  All referrers list
// ─────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────────
//  POST /api/admin/make-admin
//  Promote a user to admin (use carefully!)
// ─────────────────────────────────────────────
router.post('/make-admin', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `✅ ${user.name} is now an admin`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
