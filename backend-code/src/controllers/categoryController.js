const Category = require('../models/Category');
const redis = require('../config/redis');
const { success, error } = require('../utils/response');

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
      limit: select === 'true' ? undefined : parseInt(pageSize),
      offset: select === 'true' ? undefined : (parseInt(pageNum) - 1) * parseInt(pageSize)
    });
    
    const result = success(rows, '查询成功', count);
    await redis.setex(cacheKey, 600, JSON.stringify(result));
    
    res.json(result);
  } catch (err) {
    console.error('获取分类失败:', err);
    res.json(error('获取分类失败'));
  }
};
