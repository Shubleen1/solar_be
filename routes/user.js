const express = require('express');
const router = express.Router();

const {
  getAll,
  getOne,
  update,
  remove
} = require('../controllers/userController');

// GET ALL USERS
router.get('/', getAll);

// GET SINGLE USER
router.get('/:id', getOne);

// UPDATE USER
router.put('/:id', update);

// DELETE USER
router.delete('/:id', remove);

module.exports = router;