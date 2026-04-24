const User = require('../models/User');
const Lead = require('../models/Lead');

const getUserDashboardData = async (userId, frontendUrl) => {
  const user = await User.findById(userId).select('-password');
  const leads = await Lead.find({ referrerId: userId }).sort({ createdAt: -1 });

  const stats = {
    totalLeads: leads.length,
    pendingLeads: leads.filter(l => l.projectStatus === 'pending').length,
    installedLeads: leads.filter(l => l.projectStatus === 'installed').length,
    cancelledLeads: leads.filter(l => l.projectStatus === 'cancelled').length,
    totalEarnings: user.totalEarnings,
    pendingEarnings: user.pendingEarnings,
  };

  return {
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      referralCode: user.referralCode,
      referralLink: `${frontendUrl}/register?ref=${user.referralCode}`,
    },
    stats,
    leads,
  };
};

const getUserProfileData = async (userId) => {
  return await User.findById(userId).select('-password');
};

module.exports = { getUserDashboardData, getUserProfileData };