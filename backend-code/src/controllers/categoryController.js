const Category = require('../models/Category');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

function toLegacyCategory(record) {
  if (!record) return record;
  const data = typeof record.toJSON === 'function' ? record.toJSON() : record;
  return {
    ...data,
    _id: data.id,
    updateTime: data.updated_at || data.updatedAt || null
  };
}

exports.getClassify = async (req, res) => {
  try {
    const { pageNum = 1, pageSize = 8, select } = req.query;
    const cacheKey = `classify:${select}:${pageNum}:${pageSize}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const where = {};
    if (select === 'true') where.select = 1;

    const { count, rows } = await Category.findAndCountAll({
      where,
      order: [['sort', 'ASC']],
      limit: select === 'true' ? undefined : parseInt(pageSize, 10),
      offset: select === 'true' ? undefined : (parseInt(pageNum, 10) - 1) * parseInt(pageSize, 10)
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
