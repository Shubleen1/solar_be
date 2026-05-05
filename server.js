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
app.use(cors());
app.use(express.json());

// ✅ FIXED HERE
app.get('/test', (req, res) => {
  res.send("Test route working");
});

// ── Routes ─────────────────────────────────────
app.use('/auth',     require('./routes/auth'));     
app.use('/referral', require('./routes/referral')); 
app.use('/leads',    require('./routes/leads')); 
app.use('/queries',  require('./routes/query'));    
app.use('/user',     require('./routes/user'));   
app.use('/payments', require('./routes/payments'));
app.use('/customers', require('./routes/customers'));

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
});