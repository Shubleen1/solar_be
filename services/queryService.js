const Query = require('../models/Query');
const paginate = require('../utils/paginate');
const MESSAGES = require('../constants/messages');

const submitQuery = async (data) => {
  const { name, phone, email, projectType, message } = data;

  if (!name || !phone) {
    throw new Error(MESSAGES.COMMON.BAD_REQUEST);
  }

  return await Query.create({
    name,
    phone,
    email: email || '',
    projectType: projectType || 'Residential',
    message: message || ''
  });
};

const getAllQueries = async (params) => {
  const { page, limit, search, status } = params;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  if (status && status !== 'all') {
    filter.status = status;
  }

  return await paginate(Query, filter, { page, limit });
};

const updateQueryStatus = async (id, status) => {
  const validStatuses = ['New', 'Contacted', 'Resolved', 'Closed'];

  if (!validStatuses.includes(status)) {
    throw new Error(MESSAGES.QUERY.INVALID_STATUS);
  }

  const query = await Query.findById(id);
  if (!query) {
    throw new Error(MESSAGES.QUERY.NOT_FOUND);
  }

  query.status = status;
  await query.save();

  return query;
};

const deleteQuery = async (id) => {
  const query = await Query.findByIdAndDelete(id);

  if (!query) {
    throw new Error(MESSAGES.QUERY.NOT_FOUND);
  }

  return query;
};

module.exports = {
  submitQuery,
  getAllQueries,
  updateQueryStatus,
  deleteQuery
};