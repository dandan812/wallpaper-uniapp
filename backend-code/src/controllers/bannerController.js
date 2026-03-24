const Banner = require('../models/Banner');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

function toLegacyBanner(record) {
  if (!record) return record;
  const data = typeof record.toJSON === 'function' ? record.toJSON() : record;
  return {
    ...data,
    _id: data.id
  };
}

exports.getBanners = async (req, res) => {
  try {
    const cacheKey = 'banners:list';
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    const banners = await Banner.findAll({
      order: [['sort', 'ASC']],
      attributes: ['id', 'picurl', 'target', 'url', 'appid']
    });

    const payload = banners.map(toLegacyBanner);
    await redis.setex(cacheKey, 3600, JSON.stringify(payload));
    success(res, payload, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.getHomeBanner = exports.getBanners;
