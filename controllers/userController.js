const userService = require('../services/userService');

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

/**
 * ✅ Dashboard
 */
const getDashboard = async (req, res) => {
  try {
    const data = await userService.getUserDashboardData(
      req.user._id,
      FRONTEND_URL
    );
    res.json(data);
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ✅ Profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfileData(
      req.user._id,
      FRONTEND_URL   // 🔥 FIXED
    );
    res.json(user);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ✅ Get All Users (Admin)
 */
const allUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(
      FRONTEND_URL   // 🔥 FIXED
    );
    res.json({ data: users });
  } catch (err) {
    console.error('All users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ✅ Get User By ID (Admin)
 */
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(
      req.params.id,
      FRONTEND_URL   // 🔥 FIXED
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * ✅ Delete User
 */
const deleteUserById = async (req, res) => {
  try {
    const user = await userService.deleteUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboard,
  getProfile,
  allUsers,
  getUserById,
  deleteUserById,
};