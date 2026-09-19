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
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows image loads across origins
    contentSecurityPolicy: false, // Disabled for API server so client assets load without CSP conflict
  })
);

// 2. High-Performance HTTP Response Compression
app.use(compression());

// 3. CORS Configuration with Credential Support
const allowedOrigin = process.env.CLIENT_URI || "http://localhost:3000";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// 4. Body & Cookie Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// 5. Global API Rate Limiting
app.use("/api", apiLimiter);

// 6. Mount Domain Routes
app.use("/auth", authLimiter, authRouter);
app.use("/rooms", roomsRouter);

// 7. System Health Check Endpoint
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

// 8. Centralized Global Error Gateway
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`[Server] Production-grade Hotel API running on port ${PORT}`);
  console.log(`[Server] Allowed CORS origin: ${allowedOrigin}`);
});

export default app;