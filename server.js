const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// ── Connect to MongoDB ─────────────────────────
connectDB();

// ── Middleware ─────────────────────────────────
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true,
// }));
app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));     
app.use('/api/referral', require('./routes/referral')); 
app.use('/api/leads',    require('./routes/leads')); 
app.use('/queries',  require('./routes/queries'));    
app.use('/api/user',     require('./routes/user'));   
app.use('/api/admin',    require('./routes/admin')); // Points to admin.js

// ── Health check ───────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: '✅ Solar Referral API is running!',
    time: new Date().toISOString(),
  });
});

// ── 404 handler ────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Start server ───────────────────────────────
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
  console.log(`📋 API docs at   http://localhost:${PORT}/\n`);
});