const Redis = require('ioredis');
require('dotenv').config();

const isDevelopment = process.env.NODE_ENV !== 'production';
const memoryStore = new Map();
const memoryTimers = new Map();

let redisClient = null;
let redisAvailable = false;
let warnedMemoryFallback = false;

function clearMemoryTimer(key) {
  const timer = memoryTimers.get(key);
  if (timer) {
    clearTimeout(timer);
    memoryTimers.delete(key);
  }
}

function patternToRegExp(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replace(/\*/g, '.*')}$`);
}

const memoryRedis = {
  async get(key) {
    return memoryStore.has(key) ? memoryStore.get(key) : null;
  },

  async setex(key, ttl, value) {
    memoryStore.set(key, value);
    clearMemoryTimer(key);

    const timer = setTimeout(() => {
      memoryStore.delete(key);
      memoryTimers.delete(key);
    }, ttl * 1000);

    // 不阻止 Node 进程退出，避免开发环境被缓存定时器挂住。
    if (typeof timer.unref === 'function') {
      timer.unref();
    }

    memoryTimers.set(key, timer);
    return 'OK';
  },

  async del(...keys) {
    let deleted = 0;
    keys.flat().forEach((key) => {
      if (memoryStore.delete(key)) {
        deleted += 1;
      }
      clearMemoryTimer(key);
    });
    return deleted;
  },

  async keys(pattern = '*') {
    const matcher = patternToRegExp(pattern);
    return Array.from(memoryStore.keys()).filter((key) => matcher.test(key));
  }
};

function warnMemoryFallback(err) {
  if (warnedMemoryFallback) return;
  warnedMemoryFallback = true;
  console.warn('Redis 不可用，开发环境自动切换为内存缓存。');
  if (err) {
    console.warn('Redis fallback reason:', err.message || err);
  }
}

function createRedisClient() {
  const client = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    connectTimeout: 1000,
    retryStrategy: (times) => {
      if (!isDevelopment) {
        return Math.min(times * 50, 2000);
      }
      return null;
    }
  });

  client.on('connect', () => {
    redisAvailable = true;
    console.log('Redis 连接成功');
  });

  client.on('close', () => {
    redisAvailable = false;
  });

  client.on('error', (err) => {
    redisAvailable = false;
    if (isDevelopment) {
      warnMemoryFallback(err);
      return;
    }
    console.error('Redis 连接错误:', err);
  });

  client.connect().catch((err) => {
    redisAvailable = false;
    if (isDevelopment) {
      warnMemoryFallback(err);
      return;
    }
    console.error('Redis 初始连接失败:', err);
  });

  return client;
}

redisClient = createRedisClient();

async function runRedis(method, ...args) {
  if (redisAvailable && redisClient) {
    try {
      return await redisClient[method](...args);
    } catch (err) {
      redisAvailable = false;
      if (!isDevelopment) {
        throw err;
      }
      warnMemoryFallback(err);
    }
  }

  if (!isDevelopment) {
    throw new Error('Redis unavailable');
  }

  return memoryRedis[method](...args);
}

module.exports = {
  get(key) {
    return runRedis('get', key);
  },

  setex(key, ttl, value) {
    return runRedis('setex', key, ttl, value);
  },

  del(...keys) {
    return runRedis('del', ...keys);
  },

  keys(pattern) {
    return runRedis('keys', pattern);
  }
};
