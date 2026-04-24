const { submitQuery } = require('../services/queryService');

const submit = async (req, res) => {
  try {
    const lead = await submitQuery(req.body);

    res.status(201).json({
      message: '✅ Inquiry submitted successfully!',
      leadId: lead._id
    });

  } catch (err) {
    console.error('Lead error:', err);

    res.status(400).json({
      message: err.message || 'Something went wrong'
    });
  }
};

module.exports = { submit };