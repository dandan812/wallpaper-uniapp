const Wallpaper = require('../models/Wallpaper');
const { Sequelize } = require('sequelize');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

// 壁纸列表、详情、搜索结果都共用这一步结构转换。
// 保留 _id 是为了兼容旧页面仍然按 _id 读取主键。
function toLegacyWallpaper(record) {
  if (!record) return record;

  // Sequelize 模型实例先转普通对象，再补前端历史字段。
  const data = typeof record.toJSON === 'function' ? record.toJSON() : record;

  return {
    ...data,
    _id: data.id
  };
}

exports.getWallpapers = async (req, res) => {
  try {
    // 分类列表的参数来自 query。
    // classid 指分类，limit/skip 控制分页。
    const {
      classid,
      limit = 10,
      skip = 0
    } = req.query;

    // query 参数默认是字符串，这里统一转成整数后再传给 Sequelize。
    const currentLimit = parseInt(limit, 10);
    const currentSkip = parseInt(skip, 10);

    if (!classid) {
      return error(res, '缺少分类ID', 400);
    }

    // 缓存 key 必须带 classid、limit、skip，
    // 否则不同分类和不同页的数据会互相串掉。
    const cacheKey = `wallpapers:${classid}:${currentLimit}:${currentSkip}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    // 列表只取轻量字段，避免一次返回太多详情数据。
    const wallpapers = await Wallpaper.findAll({
      where: { classid },
      limit: currentLimit,
      offset: currentSkip,
      order: [['id', 'DESC']],
      attributes: ['id', 'classid', 'smallPicurl', 'score']
    });

    // 统一转换结构，补齐 _id，再缓存结果。
    const payload = wallpapers.map(toLegacyWallpaper);
    await redis.setex(cacheKey, 1800, JSON.stringify(payload));
    success(res, payload, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.getWallpaperDetail = async (req, res) => {
  try {
    // 详情页 id 来自路由参数，例如 /detailWall/1。
    const { id } = req.params;

    // 单条详情也适合缓存，因为同一张壁纸可能被频繁打开。
    const cacheKey = `wallpaper:${id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    // 按主键查当前壁纸详情。
    const wallpaper = await Wallpaper.findByPk(id);

    if (!wallpaper) {
      return error(res, '壁纸不存在', 404);
    }

    // 浏览量不是强一致关键数据，所以放到异步里更新，
    // 可以减少前端等待时间。
    setImmediate(async () => {
      await wallpaper.increment('view_count');
    });

    // 先返回详情，再让缓存接住后续相同请求。
    const payload = toLegacyWallpaper(wallpaper);
    await redis.setex(cacheKey, 3600, JSON.stringify(payload));
    success(res, payload, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.getRandomWallpapers = async (req, res) => {
  try {
    // limit 控制首页“每日推荐”想拿多少张图。
    const { limit = 9 } = req.query;

    // 随机推荐缓存时间故意设得短一些，
    // 这样首页不会长时间看到完全相同的一组图片。
    const cacheKey = `random_wallpapers:${limit}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    // RAND() 让数据库随机返回一组壁纸。
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
    // 搜索接口需要关键词和分页参数。
    const {
      keyword,
      limit = 10,
      skip = 0
    } = req.query;

    // 搜索分页和分类列表统一成同一套 limit / skip 规则。
    const currentLimit = parseInt(limit, 10);
    const currentSkip = parseInt(skip, 10);

    if (!keyword) {
      return error(res, '缺少搜索关键词', 400);
    }

    // 搜索结果也按“关键词 + 分页参数”缓存，避免重复查库。
    const cacheKey = `search:${keyword}:${currentLimit}:${currentSkip}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    // 当前搜索逻辑比较直接：
    // 只要标题、描述、标签任意一个字段模糊命中，就会返回。
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
