import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
    id: string;
    role?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

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
            return res.status(401).json({ message: "Access denied: No token provided" });
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
            return res.status(401).json({ message: "Token has expired, please log in again" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        console.error("Error in TokenValidator:", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};