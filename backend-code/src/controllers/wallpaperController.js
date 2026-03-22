const Wallpaper = require('../models/Wallpaper');
const { Sequelize } = require('sequelize');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

exports.getWallpapers = async (req, res) => {
  try {
    const { classid, limit = 10, skip = 0 } = req.query;

    if (!classid) {
      return error(res, '缺少分类ID', 400);
    }

    const cacheKey = `wallpapers:${classid}:${limit}:${skip}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    const wallpapers = await Wallpaper.findAll({
      where: { classid },
      limit: parseInt(limit),
      offset: parseInt(skip),
      order: [['id', 'DESC']],
      attributes: ['id', 'classid', 'smallPicurl', 'score']
    });

    await redis.setex(cacheKey, 1800, JSON.stringify(wallpapers));
    success(res, wallpapers, '查询成功');
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

    // 异步更新浏览量
    setImmediate(async () => {
      await wallpaper.increment('view_count');
    });

    await redis.setex(cacheKey, 3600, JSON.stringify(wallpaper));
    success(res, wallpaper, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.getRandomWallpapers = async (req, res) => {
  try {
    const { limit = 9 } = req.query;

    const cacheKey = `random_wallpapers:${limit}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    const wallpapers = await Wallpaper.findAll({
      order: Sequelize.literal('RAND()'),
      limit: parseInt(limit),
      attributes: ['id', 'classid', 'smallPicurl', 'score']
    });

    await redis.setex(cacheKey, 300, JSON.stringify(wallpapers));
    success(res, wallpapers, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.searchWallpapers = async (req, res) => {
  try {
    const { keyword, limit = 10, skip = 0 } = req.query;

    if (!keyword) {
      return error(res, '缺少搜索关键词', 400);
    }

    const cacheKey = `search:${keyword}:${limit}:${skip}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    const wallpapers = await Wallpaper.findAll({
      where: {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.like]: `%${keyword}%` } },
          { description: { [Sequelize.Op.like]: `%${keyword}%` } },
          { tabs: { [Sequelize.Op.like]: `%${keyword}%` } }
        ]
      },
      limit: parseInt(limit),
      offset: parseInt(skip),
      order: [['id', 'DESC']],
      attributes: ['id', 'classid', 'smallPicurl', 'score', 'title']
    });

    await redis.setex(cacheKey, 600, JSON.stringify(wallpapers));
    success(res, wallpapers, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};
