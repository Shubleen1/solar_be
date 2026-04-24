const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { user, token } = await authService.registerUser(req.body);
    res.status(201).json({
      message: '✅ Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        referralCode: user.referralCode,
        role: user.role,
      },
    });
  } catch (err) {
    if (['Please fill all required fields', 'Password must be at least 6 characters', 'Email already registered. Please login.', 'Invalid referral code'].includes(err.message)) {
      return res.status(400).json({ message: err.message });
    }
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

const login = async (req, res) => {
  try {
    const { user, token } = await authService.loginUser(req.body.email, req.body.password);
    res.json({
      message: '✅ Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        referralCode: user.referralCode,
        role: user.role,
        totalEarnings: user.totalEarnings,
        pendingEarnings: user.pendingEarnings,
      },
    });
  } catch (err) {
    if (['Please enter email and password', 'Invalid email or password'].includes(err.message)) {
      return res.status(400).json({ message: err.message });
    }
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = { register, login };