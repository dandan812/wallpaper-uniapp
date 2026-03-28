const Category = require("../models/Category");
const redis = require("../config/redis");
const { success, error } = require("../utils/response");

function parsePositiveInt(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 0 ? fallback : parsed;
}

// 当前前端已经直接使用 id，不再补历史字段 _id。
// 但分类卡片仍会读取 updateTime，所以这里保留这一层轻量映射。
function toCategoryPayload(record) {
  const data = typeof record.toJSON === "function" ? record.toJSON() : record;

  return {
    ...data,
    updateTime: data.updated_at || data.updatedAt || null,
  };
}

exports.getClassify = async (req, res) => {
  try {
    // req.query 就是前端 URL 上带过来的查询参数。
    // 例如：/api/classify?limit=8&skip=0&select=true
    const {
      // limit: 一次取多少条，默认 8 条。
      limit = 8,
      // skip: 跳过前面多少条，默认从第 0 条开始。
      skip = 0,
      // select=true 时，表示前端只想拿“精选分类”。
      select,
    } = req.query;

    // 前端传过来的 query 参数本质上是字符串，
    // 所以后端这里先显式转成整数，后面给 Sequelize 使用。
    const currentLimit = parsePositiveInt(limit, 8);
    const currentSkip = parsePositiveInt(skip, 0);

    // Redis 缓存 key 里必须带上筛选条件和分页参数，
    // 否则“精选分类”和“普通分类列表”可能会读到同一份缓存。
    // 盒子名 classify:undefined:8:8
    // 存第二页普通分类
    const cacheKey = `classify:${select}:${currentLimit}:${currentSkip}`;

    // 先查缓存：如果之前已经查过，就直接返回缓存结果，
    // 这样可以减少数据库压力，也让接口响应更快。
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // where 是 Sequelize 的查询条件对象。
    // 默认是空对象，表示“不过滤，查全部分类”。
    const where = {};

    // 当前端传 select=true 时，只查被标记为精选的分类。
    // 这些数据主要给首页“专题精选”模块使用。
    if (select === "true") where.select = 1;

    // Sequelize 提供的方法findAndCountAll 会一次返回两部分：
    // 1. count: 总条数
    // 2. rows: 当前页数据
    // 这样前端后续如果要做分页，总数也已经有了。
    const { count, rows } = await Category.findAndCountAll({
      where,
      // where = 筛选条件（查谁）
      // order = 排序规则（怎么排）
      // limit = 限制数量（拿多少）
      // offset = 偏移位置（从哪开始）
      // 分类按 sort 升序排列，数值越小越靠前。
      // order: [
      //   ['sort', 'ASC'],
      //   ['created_at', 'DESC']
      // ]
      // 👉 意思：
      // 先按 sort 排
      // 如果 sort 一样 → 再按时间排
      // order: ['字段名', '排序方式']
      order: [["sort", "ASC"]],
      // 精选分类通常数据量不大，首页希望一次取全，所以不做分页截断。
      limit: select === "true" ? undefined : currentLimit,
      offset: select === "true" ? undefined : currentSkip,
    });

    // 把数据库记录转换成前端需要的结构，并补齐兼容字段。
    const payload = rows.map(toCategoryPayload);

    // success(...) 会生成统一的返回格式：
    // { errCode, errMsg, data, timeCost, total }
    const result = success(payload, "查询成功", count);

    // 把查询结果写入 Redis，缓存 600 秒（10 分钟）。
    // 分类数据变化不算频繁，短缓存能明显减少重复查询。
    await redis.setex(cacheKey, 600, JSON.stringify(result));

    // 把最终结果返回给前端。
    res.json(result);
  } catch (err) {
    // 这里主要兜底数据库错误、Redis 错误、参数异常等情况。
    console.error("获取分类失败:", err);

    // 统一返回错误结构，避免前端拿到不可预测的报错格式。
    res.json(error("获取分类失败"));
  }
};
