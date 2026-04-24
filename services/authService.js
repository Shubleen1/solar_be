const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateReferralCode } = require('../utils/generateCode');
const { sendEmail, welcomeEmail } = require('../utils/sendEmail');

const registerUser = async (userData) => {
  const { name, email, phone, password, referredBy } = userData;

  if (!name || !email || !phone || !password) throw new Error('Please fill all required fields');
  if (password.length < 6) throw new Error('Password must be at least 6 characters');

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already registered. Please login.');

  if (referredBy) {
    const referrer = await User.findOne({ referralCode: referredBy.toUpperCase() });
    if (!referrer) throw new Error('Invalid referral code');
  }

  const referralCode = await generateReferralCode(name);

  const user = await User.create({
    name,
    email,
    phone,
    password,
    referralCode,
    referredBy: referredBy ? referredBy.toUpperCase() : null,
  });

  const emailTemplate = welcomeEmail(name, referralCode, process.env.FRONTEND_URL);
  await sendEmail({ to: email, ...emailTemplate });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  return { user, token };
};

const loginUser = async (email, password) => {
  if (!email || !password) throw new Error('Please enter email and password');

  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  return { user, token };
};

module.exports = { registerUser, loginUser };