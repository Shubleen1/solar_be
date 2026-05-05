const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.use(protect);

router.get('/dashboard', userController.getDashboard);
router.get('/profile', userController.getProfile);
router.get('/all', userController.allUsers);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUserById);

module.exports = router;