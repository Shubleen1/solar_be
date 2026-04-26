const express = require('express');
const router = express.Router();

// import controller
const { submit } = require('../controllers/queryController');

// POST route for contact/inquiry
router.post('/submit', submit);

module.exports = router;