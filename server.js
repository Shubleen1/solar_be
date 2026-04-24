const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

const app = express();

// ── Connect to MongoDB ─────────────────────────
connectDB();

// ── Middleware ─────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json()); // lets us read JSON from request body

// ── Routes ─────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));     // register, login
app.use('/api/referral', require('./routes/referral')); // get/validate codes
app.use('/api/leads',    require('./routes/leads'));    // customer inquiry
app.use('/api/user',     require('./routes/user'));     // user dashboard
app.use('/api/admin',    require('./routes/admin'));    // admin panel

// ── Health check (visit this to confirm server is running) ──
app.get('/', (req, res) => {
  res.json({
    status: '✅ Solar Referral API is running!',
    time:   new Date().toISOString(),
    routes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/referral/validate/:code',
      'GET  /api/referral/my-code',
      'POST /api/leads/submit',
      'GET  /api/user/dashboard',
      'GET  /api/admin/stats',
      'GET  /api/admin/leads',
      'PUT  /api/admin/leads/:id',
      'PUT  /api/admin/leads/:id/pay',
      'GET  /api/admin/users',
    ],
  });
});

// ── 404 handler ────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Start server ───────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
  console.log(`📋 API docs at   http://localhost:${PORT}/\n`);
});
