const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    // 选 finish 而不是请求进入时打印，这样可以拿到最终状态码和耗时。
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
};

module.exports = logger;
