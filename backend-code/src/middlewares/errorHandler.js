const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || '服务器内部错误';

  res.status(status).json({
    errCode: status,
    errMsg: message,
    data: null
  });
};

module.exports = errorHandler;
