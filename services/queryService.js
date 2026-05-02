const Query = require('../models/Query');

const submitQuery = async (data) => {
  const { name, phone, email, projectType, message } = data;

  if (!name || !phone) {
    throw new Error('Name and phone are required');
  }

  return await Query.create({
    name,
    phone,
    email: email || '',
    projectType: projectType || 'Residential',
    message: message || ''
  });
};

const getAllQueries = async () => {
  return await Query.find().sort({ createdAt: -1 });
};

const updateQueryStatus = async (id, status) => {
  const validStatuses = ['New', 'Contacted', 'Resolved', 'Closed'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }
  const query = await Query.findById(id);
  if (!query) {
    throw new Error('Query not found');
  } else {
    query.status = status;
    await query.save();
    return query;
  }
};

const deleteQuery = async (id) => {
  return await Query.findByIdAndDelete(id);
};

module.exports = {
  submitQuery,
  getAllQueries,
  deleteQuery,
  updateQueryStatus
};