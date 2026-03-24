const Wallpaper = require('../models/Wallpaper');
const { Sequelize } = require('sequelize');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

function toLegacyWallpaper(record) {
  if (!record) return record;
  const data = typeof record.toJSON === 'function' ? record.toJSON() : record;
  // 继续保留 _id，避免旧前端页面和缓存数据因为字段名变化直接失效。
  return {
    ...data,
    _id: data.id
  };
}

exports.getWallpapers = async (req, res) => {
  try {
    const {
      classid,
      limit,
      skip,
      pageNum = 1,
      pageSize = 10
    } = req.query;
    // 当前接口优先推荐使用 limit + skip，
    // 但仍兼容 pageNum + pageSize，方便老页面平滑过渡。
    const currentLimit = parseInt(limit ?? pageSize, 10);
    const currentSkip = parseInt(skip ?? ((parseInt(pageNum, 10) - 1) * currentLimit), 10);

    if (!classid) {
      return error(res, '缺少分类ID', 400);
    }

    // 分类列表天然适合缓存，key 中必须带上分页参数，避免串页。
    const cacheKey = `wallpapers:${classid}:${currentLimit}:${currentSkip}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    const wallpapers = await Wallpaper.findAll({
      where: { classid },
      limit: currentLimit,
      offset: currentSkip,
      order: [['id', 'DESC']],
      attributes: ['id', 'classid', 'smallPicurl', 'score']
    });

    const payload = wallpapers.map(toLegacyWallpaper);
    await redis.setex(cacheKey, 1800, JSON.stringify(payload));
    success(res, payload, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.getWallpaperDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const cacheKey = `wallpaper:${id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    const wallpaper = await Wallpaper.findByPk(id);

    if (!wallpaper) {
      return error(res, '壁纸不存在', 404);
    }

    // 浏览量更新不阻塞主响应，先把详情返回给前端再异步自增。
    setImmediate(async () => {
      await wallpaper.increment('view_count');
    });

    const payload = toLegacyWallpaper(wallpaper);
    await redis.setex(cacheKey, 3600, JSON.stringify(payload));
    success(res, payload, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.getRandomWallpapers = async (req, res) => {
  try {
    const { limit = 9 } = req.query;

    // 随机推荐缓存时间较短，避免首页长时间看到完全相同的结果。
    const cacheKey = `random_wallpapers:${limit}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    const wallpapers = await Wallpaper.findAll({
      order: Sequelize.literal('RAND()'),
      limit: parseInt(limit, 10),
      attributes: ['id', 'classid', 'smallPicurl', 'score']
    });

    const payload = wallpapers.map(toLegacyWallpaper);
    await redis.setex(cacheKey, 300, JSON.stringify(payload));
    success(res, payload, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.searchWallpapers = async (req, res) => {
  try {
    const {
      keyword,
      limit,
      skip,
      pageNum = 1,
      pageSize = 10
    } = req.query;
    // 搜索列表与分类列表保持同一套分页兼容规则，便于前端统一调用。
    const currentLimit = parseInt(limit ?? pageSize, 10);
    const currentSkip = parseInt(skip ?? ((parseInt(pageNum, 10) - 1) * currentLimit), 10);

    if (!keyword) {
      return error(res, '缺少搜索关键词', 400);
    }

    const cacheKey = `search:${keyword}:${currentLimit}:${currentSkip}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    // 当前搜索能力走模糊匹配，覆盖标题、描述和标签三个常用字段。
    const wallpapers = await Wallpaper.findAll({
      where: {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.like]: `%${keyword}%` } },
          { description: { [Sequelize.Op.like]: `%${keyword}%` } },
          { tabs: { [Sequelize.Op.like]: `%${keyword}%` } }
        ]
      },
      limit: currentLimit,
      offset: currentSkip,
      order: [['id', 'DESC']],
      attributes: ['id', 'classid', 'smallPicurl', 'score', 'title']
    });

    const payload = wallpapers.map(toLegacyWallpaper);
    await redis.setex(cacheKey, 600, JSON.stringify(payload));
    success(res, payload, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};
