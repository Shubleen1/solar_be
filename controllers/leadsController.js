const leadsService = require('../services/leadsService');

const submit = async (req, res) => {
  try {
    const lead = await leadsService.submitNewLead(req.body);
    res.status(201).json({
      message: '✅ Inquiry submitted successfully! Our team will contact you within 24 hours.',
      leadId: lead._id,
    });
  } catch (err) {
    if (['Please fill all required fields', 'Invalid referral code', 'Invalid referral code. Please check and try again.', 'This phone number already submitted an inquiry with this code.'].includes(err.message)) {
      return res.status(400).json({ message: err.message });
    }
    console.error('Lead submit error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = { submit };