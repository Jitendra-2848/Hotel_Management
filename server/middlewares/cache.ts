import { type Request, type Response, type NextFunction } from "express";
import { getCache, setCache, isCacheAvailable } from "../lib/redis.ts";

/**
 * Express middleware to cache GET requests in Redis
 * @param ttlSeconds Time-to-live in seconds (default 120s)
 * @param keyPrefix Optional key prefix (e.g. 'rooms')
 */
export const cacheMiddleware = (ttlSeconds: number = 120, keyPrefix: string = "api") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET" || !isCacheAvailable()) {
      return next();
    }

    const key = `${keyPrefix}:${req.originalUrl || req.url}`;

    try {
      const cached = await getCache(key);
      if (cached) {
        res.setHeader("X-Cache-Status", "HIT");
        return res.status(200).json(cached);
      }
    } catch {
      // Fall through to database on any cache read failure
    }

    res.setHeader("X-Cache-Status", "MISS");

    // Intercept res.json to capture output and store into cache
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      // Only cache successful 200 responses
      if (res.statusCode === 200 && body) {
        setCache(key, body, ttlSeconds).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  };
};
