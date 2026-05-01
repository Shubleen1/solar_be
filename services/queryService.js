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

module.exports = {
  submitQuery,
  getAllQueries
};