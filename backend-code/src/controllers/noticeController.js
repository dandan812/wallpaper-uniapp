const Notice = require('../models/Notice');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

// 公告列表和详情页曾经依赖 _id，所以这里统一补齐兼容字段。
function toLegacyNotice(record) {
  if (!record) return record;

  // 查询结果如果是 Sequelize 模型实例，先转成普通对象再处理。
  const data = typeof record.toJSON === 'function' ? record.toJSON() : record;

  return {
    ...data,
    _id: data.id,
    // 旧前端详情页读取 publish_date，这里统一映射到创建时间。
    publish_date: data.created_at || data.createdAt || null
  };
}

exports.getNotices = async (req, res) => {
  try {
    // limit / skip 都来自前端 query 参数。
    // 例如：/api/notice?limit=10&skip=0
    const { limit = 10, skip = 0, select } = req.query;

    // 公告列表要按分页参数区分缓存，否则不同页会读到同一份数据。
    const cacheKey = `notices:list:${select}:${limit}:${skip}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    const where = {
      status: 1
    };

    // 首页公告条有时只想取置顶公告，这里兼容 select=true 的筛选方式。
    if (select === 'true') {
      where.select = 1;
    }

    // 公告默认按 id 倒序，让最新公告排在最前面。
    const notices = await Notice.findAll({
      where,
      order: [['id', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(skip, 10)
    });

    // 转成前端结构后写入缓存，再返回给调用方。
    const payload = notices.map(toLegacyNotice);
    await redis.setex(cacheKey, 600, JSON.stringify(payload));
    success(res, payload, '查询成功');
  } catch (err) {
    // 公告接口异常一般来自数据库查询或缓存读写失败。
    error(res, err.message);
  }
};

exports.getNoticeDetail = async (req, res) => {
  try {
    // 详情页的 id 来自路由参数，比如 /notice/1。
    const { id } = req.params;

    if (!id) {
      return error(res, '缺少公告ID', 400);
    }

    // 单条公告详情很适合缓存：读多写少，数据量也小。
    const cacheKey = `notice:detail:${id}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return success(res, JSON.parse(cached), '查询成功');
    }

    // findByPk 表示按主键 id 直接查一条记录。
    const notice = await Notice.findByPk(id);

    if (!notice) {
      return error(res, '公告不存在', 404);
    }

    // 阅读数不是强一致要求，异步自增即可。
    setImmediate(async () => {
      await notice.increment('view_count');
    });

    // 返回前统一转一次结构，顺便补上 _id 字段。
    const payload = toLegacyNotice({
      ...notice.toJSON(),
      view_count: (notice.view_count || 0) + 1
    });
    await redis.setex(cacheKey, 600, JSON.stringify(payload));
    success(res, payload, '查询成功');
  } catch (err) {
    error(res, err.message);
  }
};

exports.getWallNewsList = exports.getNotices;
exports.getWallNewsDetail = exports.getNoticeDetail;
// 这两个别名是为了兼容前端历史接口名，便于线上平滑过渡。
