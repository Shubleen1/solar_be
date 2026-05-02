const express = require('express');
const router = express.Router();

// import controller
const { submit, getAll,updateQuery, deleteQ } = require('../controllers/queryController');

// POST route for contact/inquiry
router.post('/save', submit);
router.get('/', getAll);
router.put('/status/:id', updateQuery);
router.delete('/:id', deleteQ);
module.exports = router;