const sendResponse = (res, { statusCode, success = true, message, data = null, meta = null }) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    ...(meta && { meta }),
  });
};

module.exports = sendResponse;