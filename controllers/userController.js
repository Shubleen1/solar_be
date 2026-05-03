const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../services/userService');

const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');
const sendResponse = require('../utils/response');

// GET ALL USERS
const getAll = async (req, res) => {
  try {
    const result = await getAllUsers(req.query);

    return sendResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: "Users fetched successfully",
      data: result.data,
      meta: result.pagination
    });

  } catch (err) {
    return sendResponse(res, {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      success: false,
      message: MESSAGES.COMMON.SERVER_ERROR
    });
  }
};

// GET SINGLE USER
const getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    return sendResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: "User fetched successfully",
      data: user
    });

  } catch (err) {
    return sendResponse(res, {
      statusCode: HTTP_STATUS.NOT_FOUND,
      success: false,
      message: err.message
    });
  }
};

// UPDATE USER
const update = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await updateUser(id, req.body);

    return sendResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: "User updated successfully",
      data: updatedUser
    });

  } catch (err) {
    return sendResponse(res, {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      success: false,
      message: err.message || MESSAGES.COMMON.SERVER_ERROR
    });
  }
};

// DELETE USER
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteUser(id);

    return sendResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: "User deleted successfully"
    });

  } catch (err) {
    return sendResponse(res, {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      success: false,
      message: err.message || MESSAGES.COMMON.SERVER_ERROR
    });
  }
};

module.exports = {
  getAll,
  getOne,
  update,
  remove
};