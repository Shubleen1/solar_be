const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (data) => {
  const { name, email, password, role } = data;

  if (!name || !email || !password) {
    throw new Error('Name, email and password are required');
  }

  // check existing
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role === 'admin' ? 'admin' : 'user' // safety
  });

  return {
    id: user._id,
    email: user.email,
    role: user.role
  };
};

const loginUser = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // JWT (no expiry as per your requirement)
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET
  );

  return {
    token,
    name: user.name,
    role: user.role
  };
};

module.exports = {
  registerUser,
  loginUser
};