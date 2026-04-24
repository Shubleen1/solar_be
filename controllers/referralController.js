const referralService = require('../services/referralService');

const validate = async (req, res) => {
  try {
    const user = await referralService.validateReferralCode(req.params.code);
    res.json({
      valid: true,
      referrerName: user.name,
      message: `✅ Valid code! Referred by ${user.name}`,
    });
  } catch (err) {
    if (err.message === 'This referral code does not exist.') {
      return res.status(404).json({ valid: false, message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyCode = async (req, res) => {
  try {
    const details = await referralService.getMyReferralDetails(req.user._id, process.env.FRONTEND_URL);
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { validate, getMyCode };