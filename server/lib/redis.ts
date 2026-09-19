import { Redis } from "ioredis";

// Determine Redis connection URL strictly from environment variables
const REDIS_URL = process.env.REDIS_URL;

let isRedisConnected = false;
let redisClient: Redis | null = null;

// Only initialize Redis client if REDIS_URL is explicitly configured
if (REDIS_URL) {
  try {
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false, // Prevents requests hanging if Redis is unreachable
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 3) {
          return null; // Stop retrying if Redis is not running
        }
        return Math.min(times * 100, 2000);
      },
    });

    redisClient.on("connect", () => {
      isRedisConnected = true;
      console.log("[Redis] Connected to Redis instance");
    });

    redisClient.on("ready", () => {
      isRedisConnected = true;
    });

    redisClient.on("error", (err) => {
      isRedisConnected = false;
      if (process.env.NODE_ENV !== "test") {
        console.warn(`[Redis Notice] Connection issue: ${err.message}. Operating with direct database queries.`);
      }
    });

    redisClient.on("close", () => {
      isRedisConnected = false;
    });

    // Attempt initial connection asynchronously
    redisClient.connect().catch((err) => {
      isRedisConnected = false;
      console.warn(`[Redis Notice] Could not connect to REDIS_URL (${err.message}). Running with direct database queries.`);
    });
  } catch (err: any) {
    console.warn(`[Redis Error] Failed to initialize Redis client: ${err?.message}`);
  }
} else {
  // REDIS_URL is not provided in environment; caching is safely bypassed
  console.log("[Redis Notice] REDIS_URL environment variable is not defined. Running without Redis cache.");
}

/**
 * Check if Redis cache is currently connected and operational
 */
export const isCacheAvailable = (): boolean => {
  return isRedisConnected && redisClient !== null && redisClient.status === "ready";
};

/**
 * Retrieve parsed JSON value from Redis
 */
export const getCache = async <T = any>(key: string): Promise<T | null> => {
  if (!isCacheAvailable() || !redisClient) return null;
  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
};

/**
 * Store a JSON value in Redis with TTL in seconds
 */
export const setCache = async (key: string, value: any, ttlSeconds: number = 120): Promise<void> => {
  if (!isCacheAvailable() || !redisClient) return;
  try {
    const serialized = JSON.stringify(value);
    await redisClient.setex(key, ttlSeconds, serialized);
  } catch {
    // Ignore cache set failures gracefully
  }
};

/**
 * Delete a specific key from Redis
 */
export const deleteCache = async (key: string): Promise<void> => {
  if (!isCacheAvailable() || !redisClient) return;
  try {
    await redisClient.del(key);
  } catch {
    // Ignore cache delete failures gracefully
  }
};

/**
 * Invalidate all keys matching a specific pattern (e.g. "rooms:*")
 */
export const invalidateCachePattern = async (pattern: string): Promise<void> => {
  if (!isCacheAvailable() || !redisClient) return;
  try {
    const stream = redisClient.scanStream({
      match: pattern,
      count: 100,
    });

    stream.on("data", async (keys: string[]) => {
      if (keys.length && redisClient) {
        const pipeline = redisClient.pipeline();
        keys.forEach((k) => pipeline.del(k));
        await pipeline.exec();
      }
    });
  } catch {
    // Ignore cache invalidation failures gracefully
  }
};

export default redisClient;
