const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware'); // <-- Fixed import!
const adminController = require('../controllers/adminController');

// Every admin route requires: logged in + role = 'admin'
router.use(protect, adminOnly);

router.get('/stats', adminController.getStats);
router.get('/leads', adminController.getLeads);
router.put('/leads/:id', adminController.updateLead);
router.put('/leads/:id/pay', adminController.payCommission);
router.get('/users', adminController.getUsers);
router.post('/make-admin', adminController.makeAdmin);

module.exports = router;