const Query = require('../models/Query');

const submitQuery = async (data) => {
  const { name, phone, email, projectType, message } = data;

  // ✅ basic validation
  if (!name || !phone) {
    throw new Error('Name and phone are required');
  }

  // ✅ save directly
  const lead = await Query.create({
    name,
    phone,
    email: email || '',
    projectType: projectType || 'Residential',
    message: message || ''
  });

  return lead;
};

module.exports = { submitQuery };