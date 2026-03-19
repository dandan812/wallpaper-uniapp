require('dotenv').config();

const validKeys = process.env.ACCESS_KEYS.split(',');

module.exports = (req, res, next) => {
  const accessKey = req.headers['access-key'] || req.query.accessKey;
  
  if (!accessKey || !validKeys.includes(accessKey)) {
    return res.json({
      errCode: 401,
      errMsg: '无效的 access-key'
    });
  }
  
  next();
};
