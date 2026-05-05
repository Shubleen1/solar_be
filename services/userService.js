const User = require('../models/User');
const Lead = require('../models/Lead');
const QRCode = require('qrcode');

/**
 * 🔥 Helper: Attach referral link + QR code to user
 */
const formatUserWithReferral = async (user, frontendUrl) => {
  if (!user) return null;

  const referralLink = `${frontendUrl}/register?ref=${user.referralCode}`;

  const qrCode = await QRCode.toDataURL(referralLink);

  return {
    ...user.toObject(),
    referralLink,
    qrCode,
  };
};

/**
 * ✅ User Dashboard Data
 */
const getUserDashboardData = async (userId, frontendUrl) => {
  const user = await User.findById(userId).select('-password');
  if (!user) return null;

  const leads = await Lead.find({ referrerId: userId }).sort({ createdAt: -1 });

  const stats = {
    totalLeads: leads.length,
    pendingLeads: leads.filter(l => l.projectStatus === 'pending').length,
    installedLeads: leads.filter(l => l.projectStatus === 'installed').length,
    cancelledLeads: leads.filter(l => l.projectStatus === 'cancelled').length,
    totalEarnings: user.totalEarnings,
    pendingEarnings: user.pendingEarnings,
  };

  const userWithReferral = await formatUserWithReferral(user, frontendUrl);

  return {
    user: userWithReferral,
    stats,
    leads,
  };
};

/**
 * ✅ Get User Profile
 */
const getUserProfileData = async (userId, frontendUrl) => {
  const user = await User.findById(userId).select('-password');
  if (!user) return null;

  return await formatUserWithReferral(user, frontendUrl);
};

/**
 * ✅ Get All Users (Admin)
 */
const getAllUsers = async (frontendUrl) => {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 });

  const formattedUsers = await Promise.all(
    users.map(user => formatUserWithReferral(user, frontendUrl))
  );

  return formattedUsers;
};

/**
 * ✅ Get User By ID (Admin)
 */
const getUserById = async (id, frontendUrl) => {
  const user = await User.findById(id).select('-password');
  if (!user) return null;

  return await formatUserWithReferral(user, frontendUrl);
};

/**
 * ✅ Delete User
 */
const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  getUserDashboardData,
  getUserProfileData,
  getAllUsers,
  getUserById,
  deleteUserById,
};