const express = require('express');
const router = express.Router();

// import controller
const { submit, getAll,updateQueryStatus, deleteQuery } = require('../controllers/queryController');

// POST route for contact/inquiry
router.post('/save', submit);
router.get('/', getAll);
router.put('/status/:id', updateQueryStatus);
router.delete('/:id', deleteQuery);
module.exports = router;