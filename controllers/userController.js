const userService = require('../services/userService');

const getDashboard = async (req, res) => {
  try {
    const data = await userService.getUserDashboardData(req.user._id, process.env.FRONTEND_URL);
    res.json(data);
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfileData(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard, getProfile };