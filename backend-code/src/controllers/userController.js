const User = require('../models/User');
const Score = require('../models/Score');
const Download = require('../models/Download');
const Wallpaper = require('../models/Wallpaper');
const { success, error } = require('../utils/response');
const { Sequelize } = require('sequelize');

function toLegacyWallpaper(record) {
  if (!record) return record;
  const data = typeof record.toJSON === 'function' ? record.toJSON() : record;

  // 用户历史页还在依赖 _id，这里统一兼容，避免 controller 外再做二次转换。
  return {
    ...data,
    _id: data.id
  };
}

function parseAddress(address) {
  // 数据库里 address 是一段字符串，这里拆成前端页面更容易直接渲染的结构。
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

async function resolveUserId(userId) {
  // 当前项目还没有完整登录态，所以缺少 userId 时回退到首个用户，
  // 这样个人页、评分、下载等接口在演示环境也能正常工作。
  if (userId) {
    return userId;
  }

  const firstUser = await User.findOne({ order: [['id', 'ASC']] });
  return firstUser ? firstUser.id : null;
}

exports.getUserInfo = async (req, res) => {
  try {
    const { userId } = req.query;

    // 显式传 userId 时查指定用户，不传时回退到默认用户。
    const user = userId
      ? await User.findByPk(userId)
      : await User.findOne({ order: [['id', 'ASC']] });

    if (!user) {
      return error(res, '用户不存在', 404);
    }

    const currentUserId = user.id;
    const scoreCount = await Score.count({ where: { user_id: currentUserId } });
    const downloadCount = await Download.count({ where: { user_id: currentUserId } });

    // 这里同时返回新旧两套统计字段，兼容旧前端文案和新接口文档。
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
    const {
      userId,
      wallpaperId,
      wallId,
      score,
      userScore
    } = req.body;

    // 兼容新旧参数名：
    // 新：wallpaperId + score
    // 旧：wallId + userScore
    const currentUserId = await resolveUserId(userId);
    const currentWallpaperId = wallpaperId || wallId;
    const scoreValue = score ?? userScore;

    if (!currentUserId || !currentWallpaperId || scoreValue === undefined || scoreValue === null) {
      return error(res, '参数不完整', 400);
    }

    if (scoreValue < 0 || scoreValue > 5) {
      return error(res, '评分必须在 0 到 5 之间', 400);
    }

    const wallpaper = await Wallpaper.findByPk(currentWallpaperId);
    if (!wallpaper) {
      return error(res, '壁纸不存在', 404);
    }

    // 每个用户对同一张壁纸只允许评分一次，避免重复刷分。
    const [, created] = await Score.findOrCreate({
      where: { user_id: currentUserId, wallpaper_id: currentWallpaperId },
      defaults: {
        classid: wallpaper.classid,
        score: scoreValue
      }
    });

    if (!created) {
      return error(res, '您已经评分过了', 400);
    }

    // 平均分和评分人数异步回写到壁纸主表，减少主请求等待时间。
    setImmediate(async () => {
      const avgScore = await Score.findOne({
        where: { wallpaper_id: currentWallpaperId },
        attributes: [[Sequelize.fn('AVG', Sequelize.col('score')), 'avg_score']],
        raw: true
      });

      const scoreCount = await Score.count({ where: { wallpaper_id: currentWallpaperId } });

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
    const { userId, wallpaperId, wallId } = req.body;

    // 下载接口只认一张壁纸，不区分老参数还是新参数。
    const currentUserId = await resolveUserId(userId);
    const currentWallpaperId = wallpaperId || wallId;

    if (!currentUserId || !currentWallpaperId) {
      return error(res, '参数不完整', 400);
    }

    const wallpaper = await Wallpaper.findByPk(currentWallpaperId);
    if (!wallpaper) {
      return error(res, '壁纸不存在', 404);
    }

    await Download.create({
      user_id: currentUserId,
      wallpaper_id: currentWallpaperId,
      classid: wallpaper.classid
    });

    // 下载次数不是强一致关键数据，异步自增就够用。
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
    const {
      userId,
      type,
      limit,
      skip,
      pageNum = 1,
      pageSize = 10
    } = req.query;

    // 用户历史列表延续全项目的分页兼容策略，方便新旧页面共存。
    const currentUserId = await resolveUserId(userId);
    const currentLimit = parseInt(limit ?? pageSize, 10);
    const currentSkip = parseInt(skip ?? ((parseInt(pageNum, 10) - 1) * currentLimit), 10);

    if (!currentUserId || !type) {
      return error(res, '参数不完整', 400);
    }

    let wallpapers = [];

    if (type === 'score') {
      // 评分历史额外带回 user_score，前端可以直接展示“我打了几分”。
      const scores = await Score.findAll({
        where: { user_id: currentUserId },
        include: [{
          model: Wallpaper,
          attributes: ['id', 'classid', 'smallPicurl', 'score', 'title']
        }],
        limit: currentLimit,
        offset: currentSkip,
        order: [['created_at', 'DESC']]
      });
      wallpapers = scores.map(item => ({
        ...toLegacyWallpaper(item.Wallpaper),
        user_score: item.score
      }));
    } else if (type === 'download') {
      // 下载历史只关心壁纸本身，不需要额外附带评分字段。
      const downloads = await Download.findAll({
        where: { user_id: currentUserId },
        include: [{
          model: Wallpaper,
          attributes: ['id', 'classid', 'smallPicurl', 'score', 'title']
        }],
        limit: currentLimit,
        offset: currentSkip,
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
