const Banner = require('../models/Banner');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

exports.getBanners = async (req, res) => {
  try {
    // 轮播图变化频率很低，所以先查 Redis 缓存，
    // 可以减少数据库查询次数，也能让首页首屏更快。
    const cacheKey = 'banners:list';
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    // sort 越小越靠前，前端轮播图按这个顺序展示。
    // attributes 只取前端会用到的字段，避免返回无关数据。
    const banners = await Banner.findAll({
      order: [['sort', 'ASC']],
      attributes: ['id', 'picurl', 'target', 'url', 'appid']
    });

    // 当前前端直接使用 id / picurl / target / url / appid，
    // 不再额外补历史字段 _id，减少一层无意义转换。
    const payload = banners.map(item => item.toJSON());

    // 缓存 1 小时，适合这种“读多写少”的首页配置数据。
    await redis.setex(cacheKey, 3600, JSON.stringify(payload));
    success(res, payload, '查询成功');
  } catch (err) {
    // banner 逻辑本身很简单，异常大多来自数据库或 Redis。
    error(res, err.message);
  }
};

exports.getHomeBanner = exports.getBanners;
// /homeBanner 是前端历史命名，这里直接复用同一套逻辑，避免两份实现分叉。
