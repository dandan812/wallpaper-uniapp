const Notice = require('../models/Notice');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

exports.getNotices = async (req, res) => {
  try {
    const cacheKey = 'notices:list';
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    const notices = await Notice.findAll({
      order: [['id', 'DESC']],
      limit: 10
    });

    await redis.setex(cacheKey, 3600, JSON.stringify(notices));
    success(res, notices, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};
