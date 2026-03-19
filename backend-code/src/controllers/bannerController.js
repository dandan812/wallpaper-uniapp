const Banner = require('../models/Banner');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

exports.getBanners = async (req, res) => {
  try {
    const cacheKey = 'banners:list';
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    const banners = await Banner.findAll({
      order: [['sort', 'ASC']],
      attributes: ['id', 'picurl', 'target']
    });

    await redis.setex(cacheKey, 3600, JSON.stringify(banners));
    success(res, banners, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};
