import "dotenv/config";

import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";

import authRouter from "./routes/Auth.ts";
import roomsRouter from "./routes/Rooms.ts";
import { apiLimiter, authLimiter } from "./middlewares/rateLimiter.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { isCacheAvailable } from "./lib/redis.ts";

const app = express();

// 1. Security HTTP Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

app.use(compression());

const configuredOrigins = (process.env.CLIENT_URI || process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/$/, "");
      const isAllowed =
        configuredOrigins.includes(normalized) ||
        normalized === "http://localhost:3000" ||
        normalized === "http://127.0.0.1:3000" ||
        normalized.endsWith(".vercel.app");

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error(`CORS error: Origin ${origin} not permitted`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/api", apiLimiter);

app.use("/auth", authLimiter, authRouter);
app.use("/rooms", roomsRouter);

app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    status: "Healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cache: {
      redisConnected: isCacheAvailable(),
    },
    environment: process.env.NODE_ENV || "development",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;