const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Protect any route: user must be logged in ──
const protect = async (req, res, next) => {
  try {
    // Token comes in header like: "Authorization: Bearer eyJhbGci..."
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not logged in. Please login first.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request so routes can use req.user
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(); // continue to the route
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired. Please login again.' });
  }
};

// ── Admin only: user must have role = 'admin' ──
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { protect, adminOnly };
