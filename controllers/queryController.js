const {
  submitQuery,
  getAllQueries
} = require('../services/queryService');

const submit = async (req, res) => {
  try {
    const lead = await submitQuery(req.body);

    res.status(201).json({
      message: '✅ Inquiry submitted successfully!',
      leadId: lead._id
    });

  } catch (err) {
    res.status(400).json({
      message: err.message || 'Something went wrong'
    });
  }
};

const getAll = async (req, res) => {
  try {
    const queries = await getAllQueries();

    res.status(200).json({
      success: true,
      count: queries.length,
      data: queries
    });

  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch queries'
    });
  }
};

module.exports = {
  submit,
  getAll
};