import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
    id: string;
    role?: "GUEST" | "STAFF" | "MANAGER" | string;
    email?: string;
    name?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

/**
 * Middleware to validate JWT token from HTTP-only cookie or Authorization Bearer header
 */
export const ValidateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.token;

        let token: string | undefined;

        if (cookieToken) {
            token = cookieToken;
        } else if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied: No authentication token provided. Please log in.",
            });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        req.user = decoded;
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired, please log in again.",
            });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token.",
            });
        }
        console.error("Error in TokenValidator:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication.",
        });
    }
};

/**
 * Role-Based Access Control (RBAC) Guard
 * Ensures the authenticated user has one of the allowed roles
 */
export const requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Access denied: Authentication required.",
            });
        }

        const userRole = req.user.role || "GUEST";
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Access requires one of [${allowedRoles.join(", ")}] roles. Your role is ${userRole}.`,
            });
        }

        next();
    };
};

export const OptionalToken = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.token;
        const token = cookieToken || (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined);
        if (token && process.env.JWT_SECRET) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as AuthPayload;
            req.user = decoded;
        }
    } catch {
        // Proceed without user
    }
    next();
};