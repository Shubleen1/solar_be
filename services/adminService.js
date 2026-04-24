// src/services/adminService.js
const Lead = require('../models/Lead');
const User = require('../models/User');
const { sendEmail, commissionEmail } = require('../utils/sendEmail');

const getDashboardStats = async () => {
  const totalLeads = await Lead.countDocuments();
  const pendingLeads = await Lead.countDocuments({ projectStatus: 'pending' });
  const installedLeads = await Lead.countDocuments({ projectStatus: 'installed' });
  const totalUsers = await User.countDocuments({ role: 'user' });

  const pendingPayout = await Lead.aggregate([
    { $match: { commissionStatus: 'approved' } },
    { $group: { _id: null, total: { $sum: '$commissionAmount' } } },
  ]);
  const paidPayout = await Lead.aggregate([
    { $match: { commissionStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$commissionAmount' } } },
  ]);

  return {
    totalLeads,
    pendingLeads,
    installedLeads,
    totalUsers,
    pendingPayout: pendingPayout[0]?.total || 0,
    paidPayout: paidPayout[0]?.total || 0,
  };
};

const getPaginatedLeads = async (status, page = 1, limit = 20) => {
  const filter = status ? { projectStatus: status } : {};
  
  const leads = await Lead.find(filter)
    .populate('referrerId', 'name email phone referralCode')
    .sort({ createdAt: -1 })
    .skip((page - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Lead.countDocuments(filter);

  return {
    leads,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
  };
};

const updateLeadStatus = async (leadId, updateData) => {
  const { projectStatus, projectValue, adminNotes } = updateData;
  const lead = await Lead.findById(leadId).populate('referrerId');
  
  if (!lead) throw new Error('Lead not found');

  if (projectStatus) lead.projectStatus = projectStatus;
  if (adminNotes !== undefined) lead.adminNotes = adminNotes;

  if (projectValue && Number(projectValue) > 0) {
    lead.projectValue = Number(projectValue);
    lead.commissionAmount = (Number(projectValue) * lead.commissionPercent) / 100;
  }

  if (projectStatus === 'installed' && lead.commissionAmount > 0) {
    lead.commissionStatus = 'approved';

    await User.findByIdAndUpdate(lead.referrerId._id, {
      $inc: { pendingEarnings: lead.commissionAmount },
    });

    const emailTemplate = commissionEmail(
      lead.referrerId.name,
      lead.commissionAmount,
      'approved'
    );
    await sendEmail({ to: lead.referrerId.email, ...emailTemplate });
  }

  if (projectStatus === 'cancelled') {
    lead.commissionStatus = 'pending'; 
  }

  await lead.save();
  return lead;
};

const processCommissionPayment = async (leadId) => {
  const lead = await Lead.findById(leadId).populate('referrerId');
  if (!lead) throw new Error('Lead not found');

  if (lead.commissionStatus !== 'approved') {
    throw new Error('Commission must be approved before marking as paid.');
  }

  lead.commissionStatus = 'paid';
  lead.paidAt = new Date();
  await lead.save();

  await User.findByIdAndUpdate(lead.referrerId._id, {
    $inc: {
      totalEarnings: lead.commissionAmount,
      pendingEarnings: -lead.commissionAmount,
    },
  });

  const emailTemplate = commissionEmail(lead.referrerId.name, lead.commissionAmount, 'paid');
  await sendEmail({ to: lead.referrerId.email, ...emailTemplate });

  return lead;
};

const getAllReferrers = async () => {
  return await User.find({ role: 'user' })
    .select('-password')
    .sort({ createdAt: -1 });
};

const promoteUserToAdmin = async (email) => {
  const user = await User.findOneAndUpdate(
    { email },
    { role: 'admin' },
    { new: true }
  ).select('-password');

  if (!user) throw new Error('User not found');
  return user;
};

module.exports = {
  getDashboardStats,
  getPaginatedLeads,
  updateLeadStatus,
  processCommissionPayment,
  getAllReferrers,
  promoteUserToAdmin
};