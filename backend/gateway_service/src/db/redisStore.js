import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

let redisClient = null;
let isRedisConnected = false;
const inMemoryCache = new Map();

// Initialize Redis Client
export const initRedis = () => {
  try {
    const opts = {
      connectTimeout: 2000,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null, // Don't retry in infinite loops if auth fails
      enableOfflineQueue: false,
    };

    if (REDIS_URL && REDIS_URL.startsWith('rediss://')) {
      redisClient = new Redis(REDIS_URL, { ...opts, tls: {} });
    } else if (REDIS_URL && REDIS_URL.startsWith('redis://')) {
      redisClient = new Redis(REDIS_URL, opts);
    } else if (REDIS_HOST && REDIS_HOST !== '127.0.0.1') {
      redisClient = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
        ...opts,
        tls: REDIS_HOST.includes('upstash.io') ? {} : undefined,
      });
    } else {
      redisClient = new Redis({
        host: '127.0.0.1',
        port: 6379,
        ...opts,
      });
    }

    redisClient.on('connect', () => {
      isRedisConnected = true;
      console.log(`[Redis Store] Connected to Redis Cache Server successfully`);
    });

    redisClient.on('error', (err) => {
      isRedisConnected = false;
      // Disconnect cleanly if authentication fails
      if (redisClient) {
        try { redisClient.disconnect(); } catch (e) {}
      }
    });
  } catch (err) {
    isRedisConnected = false;
  }
};

// Unified Redis Cache API with Fallback
export const redisStore = {
  isRedisActive: () => isRedisConnected,

  get: async (key) => {
    if (isRedisConnected && redisClient) {
      try {
        const val = await redisClient.get(key);
        if (val) return JSON.parse(val);
      } catch (err) {
        // Fallback to memory
      }
    }
    const memVal = inMemoryCache.get(key);
    if (memVal && memVal.expiry > Date.now()) {
      return memVal.value;
    }
    return null;
  },

  set: async (key, value, ttlSeconds = 600) => {
    if (isRedisConnected && redisClient) {
      try {
        await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return true;
      } catch (err) {
        // Fallback to memory
      }
    }
    inMemoryCache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000,
    });
    return true;
  },

  del: async (key) => {
    if (isRedisConnected && redisClient) {
      try {
        await redisClient.del(key);
      } catch (err) {
        // Fallback to memory
      }
    }
    inMemoryCache.delete(key);
    return true;
  },

  delPattern: async (pattern) => {
    if (isRedisConnected && redisClient) {
      try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
          await redisClient.del(...keys);
        }
      } catch (err) {
        // Fallback to memory
      }
    }
    for (const key of inMemoryCache.keys()) {
      if (key.includes(pattern.replace('*', ''))) {
        inMemoryCache.delete(key);
      }
    }
    return true;
  },
};
