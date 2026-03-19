const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
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
