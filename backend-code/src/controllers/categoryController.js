const Category = require('../models/Category');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

function toLegacyCategory(record) {
  if (!record) return record;
  const data = typeof record.toJSON === 'function' ? record.toJSON() : record;

  // 前端历史上使用 _id / updateTime，这里统一在后端做兼容映射，
  // 这样前端迁移期间不需要同时维护多套字段名。
  return {
    ...data,
    _id: data.id,
    updateTime: data.updated_at || data.updatedAt || null
  };
}

exports.getClassify = async (req, res) => {
  try {
    const {
      pageNum = 1,
      pageSize = 8,
      limit,
      skip,
      select
    } = req.query;

    // 兼容两种分页风格：
    // 新参数：limit + skip
    // 旧参数：pageNum + pageSize
    const currentLimit = parseInt(limit ?? pageSize, 10);
    const currentSkip = parseInt(skip ?? ((parseInt(pageNum, 10) - 1) * currentLimit), 10);
    const cacheKey = `classify:${select}:${currentLimit}:${currentSkip}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // select=true 时只返回首页专题精选分类，不做分页截断。
    const where = {};
    if (select === 'true') where.select = 1;

    const { count, rows } = await Category.findAndCountAll({
      where,
      order: [['sort', 'ASC']],
      limit: select === 'true' ? undefined : currentLimit,
      offset: select === 'true' ? undefined : currentSkip
    });

    const payload = rows.map(toLegacyCategory);
    const result = success(payload, '查询成功', count);
    await redis.setex(cacheKey, 600, JSON.stringify(result));

    res.json(result);
  } catch (err) {
    console.error('获取分类失败:', err);
    res.json(error('获取分类失败'));
  }
};
