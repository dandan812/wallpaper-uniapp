const Redis = require('ioredis');
require('dotenv').config();

// Redis 主要承担查询缓存，不做业务主存储，因此连接失败时重点是记录日志和自动重试。
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    // 重试间隔随次数递增，但限制上限，避免服务重启时疯狂打日志。
    return Math.min(times * 50, 2000);
  }
});

redis.on('connect', () => {
  console.log('✓ Redis 连接成功');
});

redis.on('error', (err) => {
  console.error('✗ Redis 连接错误:', err);
});

module.exports = redis;
