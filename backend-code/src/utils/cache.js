const redis = require('../config/redis');

class CacheUtil {
  async get(key) {
    try {
      // 统一在工具层完成 JSON 反序列化，业务层只拿对象。
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Cache get error:', err);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      // 默认缓存 1 小时，具体接口可以按业务热度覆盖 ttl。
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Cache set error:', err);
      return false;
    }
  }

  async del(key) {
    try {
      await redis.del(key);
      return true;
    } catch (err) {
      console.error('Cache del error:', err);
      return false;
    }
  }

  async clear(pattern) {
    try {
      // 这里用 pattern 批量删缓存，适合数据更新后按前缀失效一组 key。
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (err) {
      console.error('Cache clear error:', err);
      return false;
    }
  }
}

module.exports = new CacheUtil();
