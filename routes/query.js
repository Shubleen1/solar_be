const express = require('express');
const router = express.Router();

// import controller
const { submit, getAll } = require('../controllers/queryController');

// POST route for contact/inquiry
router.post('/submit', submit);
router.get('/', getAll);
module.exports = router;