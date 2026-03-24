const Notice = require('../models/Notice');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

function toLegacyNotice(record) {
  if (!record) return record;
  const data = typeof record.toJSON === 'function' ? record.toJSON() : record;
  // 公告接口继续兼容 _id，避免旧页面跳详情时找不到主键字段。
  return {
    ...data,
    _id: data.id
  };
}

exports.getNotices = async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    // 公告列表按分页参数区分缓存，避免第一页和第二页相互污染。
    const cacheKey = `notices:list:${limit}:${skip}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    const notices = await Notice.findAll({
      order: [['id', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(skip, 10)
    });

    const payload = notices.map(toLegacyNotice);
    await redis.setex(cacheKey, 600, JSON.stringify(payload));
    success(res, payload, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.getNoticeDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return error(res, '缺少公告ID', 400);
    }

    // 详情页通常读取频率高于编辑频率，单条缓存性价比很高。
    const cacheKey = `notice:detail:${id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    const notice = await Notice.findByPk(id);

    if (!notice) {
      return error(res, '公告不存在', 404);
    }

    const payload = toLegacyNotice(notice);
    await redis.setex(cacheKey, 600, JSON.stringify(payload));
    success(res, payload, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.getWallNewsList = exports.getNotices;
exports.getWallNewsDetail = exports.getNoticeDetail;
// 这两个别名是为了兼容前端历史接口名，便于线上平滑过渡。
