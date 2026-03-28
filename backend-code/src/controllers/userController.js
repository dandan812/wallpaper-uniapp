const User = require('../models/User');
const Score = require('../models/Score');
const Download = require('../models/Download');
const Wallpaper = require('../models/Wallpaper');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');
const { Sequelize } = require('sequelize');

function parsePositiveInt(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 0 ? fallback : parsed;
}

// 用户历史列表里的壁纸字段已经和主列表统一成 id，不再补 _id。
function toWallpaperPayload(record) {
  if (!record) return null;

  const data = typeof record.toJSON === 'function' ? record.toJSON() : record;
  return { ...data };
}

function parseAddress(address) {
  // 数据库里 address 现在存的是一段字符串，
  // 这里拆成 { country, province, city }，前端页面更好直接展示。
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
  // 当前项目还没有完整登录态。
  // 所以当接口没传 userId 时，这里会回退到数据库里的第一个用户，
  // 这样“我的下载 / 我的评分 / 个人页”在演示环境也能正常跑通。
  if (userId) {
    return userId;
  }

  const firstUser = await User.findOne({ order: [['id', 'ASC']] });
  return firstUser ? firstUser.id : null;
}

exports.getUserInfo = async (req, res) => {
  try {
    // userId 来自前端 query 参数。
    const { userId } = req.query;

    // 如果前端显式传了 userId，就查指定用户；
    // 不传就回退到默认用户。
    const user = userId
      ? await User.findByPk(userId)
      : await User.findOne({ order: [['id', 'ASC']] });

    if (!user) {
      return error(res, '用户不存在', 404);
    }

    // 个人页上“我的评分 / 我的下载”是统计值，
    // 所以这里顺手把数量也查出来。
    const currentUserId = user.id;
    const scoreCount = await Score.count({ where: { user_id: currentUserId } });
    const downloadCount = await Download.count({ where: { user_id: currentUserId } });

    // 这里同时返回新旧两套统计字段：
    // scoreSize/downloadSize 给旧前端用，
    // score_count/download_count 也保留给新文档和后续代码使用。
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
    // 评分接口参数来自 POST body。
    const {
      userId,
      wallpaperId,
      wallId,
      score,
      userScore
    } = req.body;

    // 这里同时兼容新旧两套参数名：
    // 新前端：wallpaperId + score
    // 旧前端：wallId + userScore
    const currentUserId = await resolveUserId(userId);
    const currentWallpaperId = wallpaperId || wallId;
    const scoreValue = score ?? userScore;

    if (!currentUserId || !currentWallpaperId || scoreValue === undefined || scoreValue === null) {
      return error(res, '参数不完整', 400);
    }

    if (scoreValue < 0 || scoreValue > 5) {
      return error(res, '评分必须在 0 到 5 之间', 400);
    }

    // 评分前先确认这张壁纸真实存在。
    const wallpaper = await Wallpaper.findByPk(currentWallpaperId);
    if (!wallpaper) {
      return error(res, '壁纸不存在', 404);
    }

    // 允许同一用户重复评分：
    // 第一次评分就创建记录，后续评分就覆盖原来的分数。
    const existingScore = await Score.findOne({
      where: {
        user_id: currentUserId,
        wallpaper_id: currentWallpaperId
      }
    });

    if (existingScore) {
      await existingScore.update({
        score: scoreValue
      });
    } else {
      await Score.create({
        user_id: currentUserId,
        wallpaper_id: currentWallpaperId,
        classid: wallpaper.classid,
        score: scoreValue
      });
    }

    // 重复评分时平均分会变化，所以这里直接在当前请求里算出最新结果返回前端。
    const avgScore = await Score.findOne({
      where: { wallpaper_id: currentWallpaperId },
      attributes: [[Sequelize.fn('AVG', Sequelize.col('score')), 'avg_score']],
      raw: true
    });

    const scoreCount = await Score.count({ where: { wallpaper_id: currentWallpaperId } });
    const averageScore = Number(parseFloat(avgScore.avg_score || 0).toFixed(1));

    await wallpaper.update({
      score: averageScore,
      score_count: scoreCount
    });

    // 评分会影响详情、随机推荐、分类列表和用户历史里的分数字段，
    // 所以这里顺手把相关缓存失效，避免前端读到旧分数。
    const cachePatterns = [
      `wallpaper:${currentWallpaperId}:user:*`,
      `wallpapers:${wallpaper.classid}:*`,
      'random_wallpapers:*'
    ];

    for (const pattern of cachePatterns) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }

    success(res, {
      userScore: Number(scoreValue),
      score: averageScore,
      scoreCount,
      updated: !!existingScore
    }, existingScore ? '评分已更新' : '评分成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.downloadWall = async (req, res) => {
  try {
    // 下载记录接口也是从 POST body 取参数。
    const { userId, wallpaperId, wallId } = req.body;

    // 下载接口只需要确定“是谁下载了哪张图”，
    // 所以旧参数 wallId 和新参数 wallpaperId 都统一收口到 currentWallpaperId。
    const currentUserId = await resolveUserId(userId);
    const currentWallpaperId = wallpaperId || wallId;

    if (!currentUserId || !currentWallpaperId) {
      return error(res, '参数不完整', 400);
    }

    // 先确认目标壁纸存在，避免写入无效下载记录。
    const wallpaper = await Wallpaper.findByPk(currentWallpaperId);
    if (!wallpaper) {
      return error(res, '壁纸不存在', 404);
    }

    await Download.create({
      user_id: currentUserId,
      wallpaper_id: currentWallpaperId,
      classid: wallpaper.classid
    });

    // 下载次数只是展示数据，不要求强一致，
    // 所以这里异步自增即可。
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
    // 用户历史列表的参数来自 query：
    // type 决定查评分历史还是下载历史，
    // limit / skip 控制分页。
    const {
      userId,
      type,
      limit = 10,
      skip = 0
    } = req.query;
    const currentUserId = await resolveUserId(userId);
    const currentLimit = parsePositiveInt(limit, 10);
    const currentSkip = parsePositiveInt(skip, 0);

    if (!currentUserId || !type) {
      return error(res, '参数不完整', 400);
    }

    // 最终都整理成 wallpapers 数组返回给前端，
    // 这样 classlist 页面可以直接复用渲染逻辑。
    let wallpapers = [];

    if (type === 'score') {
      // 评分历史要额外带上 user_score，
      // 因为前端可能需要显示“我给这张图打了几分”。
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
      wallpapers = scores
        .filter(item => item.Wallpaper)
        .map(item => ({
          ...toWallpaperPayload(item.Wallpaper),
          user_score: item.score
        }));
    } else if (type === 'download') {
      // 下载历史只需要返回壁纸本身，不需要额外评分字段。
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
      wallpapers = downloads
        .filter(item => item.Wallpaper)
        .map(item => toWallpaperPayload(item.Wallpaper));
    } else {
      // type 只允许 score / download 两种。
      return error(res, '无效的类型参数', 400);
    }

    success(res, wallpapers, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};
