const User = require('../models/User');
const Score = require('../models/Score');
const Download = require('../models/Download');
const Wallpaper = require('../models/Wallpaper');
const { success, error } = require('../utils/response');
const { Sequelize } = require('sequelize');

exports.getUserInfo = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return error(res, '缺少用户ID', 400);
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return error(res, '用户不存在', 404);
    }

    const scoreCount = await Score.count({ where: { user_id: userId } });
    const downloadCount = await Download.count({ where: { user_id: userId } });

    const userInfo = {
      ...user.toJSON(),
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
      return error(res, '评分必须在0-5之间', 400);
    }

    const wallpaper = await Wallpaper.findByPk(wallpaperId);
    if (!wallpaper) {
      return error(res, '壁纸不存在', 404);
    }

    const [score, created] = await Score.findOrCreate({
      where: { user_id: userId, wallpaper_id: wallpaperId },
      defaults: { score: scoreValue }
    });

    if (!created) {
      return error(res, '您已经评分过了', 400);
    }

    // 异步更新壁纸平均分
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

    // 异步更新下载次数
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
        limit: parseInt(limit),
        offset: parseInt(skip),
        order: [['created_at', 'DESC']]
      });
      wallpapers = scores.map(s => ({ ...s.Wallpaper.toJSON(), user_score: s.score }));
    } else if (type === 'download') {
      const downloads = await Download.findAll({
        where: { user_id: userId },
        include: [{
          model: Wallpaper,
          attributes: ['id', 'classid', 'smallPicurl', 'score', 'title']
        }],
        limit: parseInt(limit),
        offset: parseInt(skip),
        order: [['created_at', 'DESC']]
      });
      wallpapers = downloads.map(d => d.Wallpaper.toJSON());
    } else {
      return error(res, '无效的类型参数', 400);
    }

    success(res, wallpapers, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};
