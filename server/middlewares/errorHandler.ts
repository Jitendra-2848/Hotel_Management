import { type Request, type Response, type NextFunction } from "express";

/**
 * Standardized JSON Error Response Envelope
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: any[];
  stack?: string;
}

/**
 * Centralized Global Error Handling Gateway Middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "An unexpected internal server error occurred.";

  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, {
    statusCode,
    message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });

  const response: ApiErrorResponse = {
    success: false,
    message,
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  // Include stack trace only in development mode
  if (process.env.NODE_ENV !== "production" && err.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};
