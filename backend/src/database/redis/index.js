/**
 * Redis Client
 */

const Redis = require("ioredis");

let redisClient = null;
let redisSubscriber = null;

/**
 * Initialize Redis connection
 */
async function initializeRedis() {
  const config = require("../../core/config");

  redisClient = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password || undefined,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  redisSubscriber = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password || undefined,
  });

  redisClient.on("connect", () => {
    console.log("✓ Redis connected");
  });

  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });

  return redisClient;
}

/**
 * Get Redis client
 */
function getRedis() {
  return redisClient;
}

/**
 * Get Redis subscriber
 */
function getRedisSubscriber() {
  return redisSubscriber;
}

/**
 * Disconnect Redis
 */
async function disconnectRedis() {
  if (redisClient) {
    await redisClient.quit();
  }
  if (redisSubscriber) {
    await redisSubscriber.quit();
  }
}

// Export utility functions for common Redis operations
module.exports = {
  initializeRedis,
  getRedis,
  getRedisSubscriber,
  disconnectRedis,
  // Convenience methods that can be imported directly
  redis: {
    get: async (key) => {
      if (!redisClient) return null;
      return await redisClient.get(key);
    },
    set: async (key, value, expirySeconds = null) => {
      if (!redisClient) return;
      if (expirySeconds) {
        return await redisClient.set(key, value, "EX", expirySeconds);
      }
      return await redisClient.set(key, value);
    },
    del: async (...keys) => {
      if (!redisClient) return;
      return await redisClient.del(...keys);
    },
    hset: async (key, field, value) => {
      if (!redisClient) return;
      return await redisClient.hset(key, field, value);
    },
    hget: async (key, field) => {
      if (!redisClient) return null;
      return await redisClient.hget(key, field);
    },
    hgetall: async (key) => {
      if (!redisClient) return {};
      return await redisClient.hgetall(key);
    },
    incr: async (key) => {
      if (!redisClient) return 0;
      return await redisClient.incr(key);
    },
    decr: async (key) => {
      if (!redisClient) return 0;
      return await redisClient.decr(key);
    },
    zadd: async (key, score, member) => {
      if (!redisClient) return;
      return await redisClient.zadd(key, score, member);
    },
    zrevrange: async (key, start, stop, withScores = true) => {
      if (!redisClient) return [];
      return await redisClient.zrevrange(
        key,
        start,
        stop,
        withScores ? "WITHSCORES" : null,
      );
    },
    zrank: async (key, member) => {
      if (!redisClient) return null;
      return await redisClient.zrank(key, member);
    },
    publish: async (channel, message) => {
      if (!redisClient) return;
      return await redisClient.publish(channel, message);
    },
  },
};
