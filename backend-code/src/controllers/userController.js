const User = require('../models/User');
const Score = require('../models/Score');
const Download = require('../models/Download');
const Wallpaper = require('../models/Wallpaper');
const { success, error } = require('../utils/response');
const { Sequelize } = require('sequelize');

function toLegacyWallpaper(record) {
  if (!record) return record;
  const data = typeof record.toJSON === 'function' ? record.toJSON() : record;
  return {
    ...data,
    _id: data.id
  };
}

function parseAddress(address) {
  if (!address) {
    return {
      country: '',
      province: '',
      city: ''
    };
  }

  const parts = String(address)
    .split(/[\s,/-]+/)
    .map(item => item.trim())
    .filter(Boolean);

  return {
    country: parts[0] || '',
    province: parts[1] || parts[0] || '',
    city: parts[2] || parts[1] || parts[0] || ''
  };
}

exports.getUserInfo = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = userId
      ? await User.findByPk(userId)
      : await User.findOne({ order: [['id', 'ASC']] });

    if (!user) {
      return error(res, '用户不存在', 404);
    }

    const currentUserId = user.id;
    const scoreCount = await Score.count({ where: { user_id: currentUserId } });
    const downloadCount = await Download.count({ where: { user_id: currentUserId } });

    const userInfo = {
      ...user.toJSON(),
      IP: user.ip || '',
      address: parseAddress(user.address),
      scoreSize: scoreCount,
      downloadSize: downloadCount,
      score_count: scoreCount,
      download_count: downloadCount
    };

    success(res, userInfo, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.setupScore = async (req, res) => {
  try {
    const { userId, wallpaperId, score: scoreValue } = req.body;

    if (!userId || !wallpaperId || !scoreValue) {
      return error(res, '参数不完整', 400);
    }

    if (scoreValue < 0 || scoreValue > 5) {
      return error(res, '评分必须在 0 到 5 之间', 400);
    }

    const wallpaper = await Wallpaper.findByPk(wallpaperId);
    if (!wallpaper) {
      return error(res, '壁纸不存在', 404);
    }

    const [, created] = await Score.findOrCreate({
      where: { user_id: userId, wallpaper_id: wallpaperId },
      defaults: { score: scoreValue }
    });

    if (!created) {
      return error(res, '您已经评分过了', 400);
    }

    setImmediate(async () => {
      const avgScore = await Score.findOne({
        where: { wallpaper_id: wallpaperId },
        attributes: [[Sequelize.fn('AVG', Sequelize.col('score')), 'avg_score']],
        raw: true
      });

      const scoreCount = await Score.count({ where: { wallpaper_id: wallpaperId } });

      await wallpaper.update({
        score: parseFloat(avgScore.avg_score).toFixed(1),
        score_count: scoreCount
      });
    });

    success(res, { score: scoreValue }, '评分成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.downloadWall = async (req, res) => {
  try {
    const { userId, wallpaperId } = req.body;

    if (!userId || !wallpaperId) {
      return error(res, '参数不完整', 400);
    }

    const wallpaper = await Wallpaper.findByPk(wallpaperId);
    if (!wallpaper) {
      return error(res, '壁纸不存在', 404);
    }

    await Download.create({
      user_id: userId,
      wallpaper_id: wallpaperId
    });

    setImmediate(async () => {
      await wallpaper.increment('download_count');
    });

    success(res, null, '下载记录成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.getUserWallList = async (req, res) => {
  try {
    const { userId, type, limit = 10, skip = 0 } = req.query;

    if (!userId || !type) {
      return error(res, '参数不完整', 400);
    }

    let wallpapers = [];

    if (type === 'score') {
      const scores = await Score.findAll({
        where: { user_id: userId },
        include: [{
          model: Wallpaper,
          attributes: ['id', 'classid', 'smallPicurl', 'score', 'title']
        }],
        limit: parseInt(limit, 10),
        offset: parseInt(skip, 10),
        order: [['created_at', 'DESC']]
      });
      wallpapers = scores.map(item => ({
        ...toLegacyWallpaper(item.Wallpaper),
        user_score: item.score
      }));
    } else if (type === 'download') {
      const downloads = await Download.findAll({
        where: { user_id: userId },
        include: [{
          model: Wallpaper,
          attributes: ['id', 'classid', 'smallPicurl', 'score', 'title']
        }],
        limit: parseInt(limit, 10),
        offset: parseInt(skip, 10),
        order: [['created_at', 'DESC']]
      });
      wallpapers = downloads.map(item => toLegacyWallpaper(item.Wallpaper));
    } else {
      return error(res, '无效的类型参数', 400);
    }

    success(res, wallpapers, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};
