const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leadsController');

router.post('/submit', leadsController.submit);

module.exports = router;