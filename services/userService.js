const User = require('../models/User');
const paginate = require('../utils/paginate');

// GET ALL USERS (WITH PAGINATION)
const getAllUsers = async (queryParams) => {
  const { page, limit, search } = queryParams;

  let query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  return paginate(User, query, {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
};

// GET SINGLE USER
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  return user;
};

// UPDATE USER
const updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!user) throw new Error('User not found');
  return user;
};

// DELETE USER
const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('User not found');
  return true;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};