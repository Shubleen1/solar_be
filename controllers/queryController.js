const {
  submitQuery,
  getAllQueries,
  updateQueryStatus,
  deleteQuery
} = require('../services/queryService');

const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');
const sendResponse = require('../utils/response');

// CREATE
const submit = async (req, res) => {
  try {
    const lead = await submitQuery(req.body);

    return sendResponse(res, {
      statusCode: HTTP_STATUS.CREATED,
      message: MESSAGES.QUERY.CREATED,
      data: { leadId: lead._id }
    });

  } catch (err) {
    return sendResponse(res, {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      success: false,
      message: err.message || MESSAGES.COMMON.SERVER_ERROR
    });
  }
};

// GET ALL (WITH PAGINATION)
const getAll = async (req, res) => {
  try {
    const result = await getAllQueries(req.query);

    return sendResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: MESSAGES.QUERY.FETCHED,
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

// UPDATE STATUS
const updateQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedQuery = await updateQueryStatus(id, status);

    return sendResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: MESSAGES.QUERY.UPDATED,
      data: updatedQuery
    });

  } catch (err) {
    return sendResponse(res, {
      statusCode: HTTP_STATUS.BAD_REQUEST,
      success: false,
      message: err.message || MESSAGES.COMMON.SERVER_ERROR
    });
  }
};

// DELETE
const deleteQ = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteQuery(id);

    return sendResponse(res, {
      statusCode: HTTP_STATUS.OK,
      message: MESSAGES.QUERY.DELETED
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
  submit,
  getAll,
  updateQuery,
  deleteQ
};