const User = require('../models/User');

const validateReferralCode = async (code) => {
  const user = await User.findOne({ referralCode: code.toUpperCase() });
  if (!user) throw new Error('This referral code does not exist.');
  return user;
};

const getMyReferralDetails = async (userId, frontendUrl) => {
  const user = await User.findById(userId).select('-password');
  return {
    referralCode: user.referralCode,
    referralLink: `${frontendUrl}/register?ref=${user.referralCode}`,
    totalLeads: user.totalLeads,
    totalEarnings: user.totalEarnings,
    pendingEarnings: user.pendingEarnings,
  };
};

module.exports = { validateReferralCode, getMyReferralDetails };