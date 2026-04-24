const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateReferralCode } = require('../utils/generateCode');
const { sendEmail, welcomeEmail } = require('../utils/sendEmail');

// ─────────────────────────────────────────────
//  POST /api/auth/register
//  Called when user fills the form after QR scan
// ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, referredBy } = req.body;

    // 1. Check required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // 2. Check password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // 3. Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    }

    // 4. If referredBy code given, validate it exists
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy.toUpperCase() });
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
    }

    // 5. Generate unique referral code for this new user
    const referralCode = await generateReferralCode(name);

    // 6. Create the user (password is hashed automatically in the model)
    const user = await User.create({
      name,
      email,
      phone,
      password,
      referralCode,
      referredBy: referredBy ? referredBy.toUpperCase() : null,
    });

    // 7. Send welcome email with their referral code
    const emailTemplate = welcomeEmail(name, referralCode, process.env.FRONTEND_URL);
    await sendEmail({ to: email, ...emailTemplate });

    // 8. Create login token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

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
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────────
//  POST /api/auth/login
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

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
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
