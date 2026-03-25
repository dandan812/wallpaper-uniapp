const Banner = require('../models/Banner');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

// 把数据库里的轮播图记录转换成前端更容易消费的格式。
// 这里保留 _id，是为了兼容旧前端历史字段命名。
function toLegacyBanner(record) {
  if (!record) return record;

  // Sequelize 查询结果默认是模型实例，这里统一转成普通对象。
  const data = typeof record.toJSON === 'function' ? record.toJSON() : record;

  return {
    ...data,
    _id: data.id
  };
}

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

    // 统一补齐兼容字段后再返回给前端。
    const payload = banners.map(toLegacyBanner);

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
