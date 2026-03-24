const errorHandler = (err, req, res, next) => {
  // Express 错误中间件签名必须保留 next，即使当前没有直接使用。
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
