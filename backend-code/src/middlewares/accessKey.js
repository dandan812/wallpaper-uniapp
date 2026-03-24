require('dotenv').config();

// 允许在 .env 中通过逗号配置多个 key，方便本地、测试、生产并存。
const validKeys = process.env.ACCESS_KEYS.split(',');

module.exports = (req, res, next) => {
  // 兼容历史调用：优先读 Header，也兼容少量旧请求走 query 参数。
  const accessKey = req.headers['access-key'] || req.query.accessKey;
  
  if (!accessKey || !validKeys.includes(accessKey)) {
    return res.json({
      errCode: 401,
      errMsg: '无效的 access-key'
    });
  }
  
  next();
};
