const {
  registerUser,
  loginUser
} = require('../services/authService');

const auth = async (req, res) => {
  try {
    const { type } = req.body;

    if (type === 'register') {
      const user = await registerUser(req.body);

      return res.status(201).json({
        message: '✅ Registered successfully',
        user
      });
    }

    if (type === 'login') {
      const data = await loginUser(req.body);

      return res.status(200).json({
        message: '✅ Login successful',
        ...data
      });
    }

    return res.status(400).json({
      message: 'Invalid type (use register or login)'
    });

  } catch (err) {
    console.error('Auth error:', err.message);

    res.status(400).json({
      message: err.message || 'Something went wrong'
    });
  }
};

module.exports = { auth };