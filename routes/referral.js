const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const referralController = require('../controllers/referralController');

router.get('/validate/:code', referralController.validate);
router.get('/my-code', protect, referralController.getMyCode);

module.exports = router;