import type{ Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.ts";
import token from "../middlewares/TokenProvider.ts";

const getCookieOptions = (req: Request) => {
    const origin = req.get("origin") || req.get("referer") || "";
    const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1") || !origin.startsWith("https");

    return {
        httpOnly: true,
        secure: !isLocal && process.env.NODE_ENV === "production",
        sameSite: (!isLocal && process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "GUEST",
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        const authToken = token({
            id: newUser.id,
            role: newUser.role,
            time: "7d",
        });

        res.cookie("token", authToken, getCookieOptions(req));

        return res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            token: authToken,
        });
    } catch (error: any) {
        console.error("Error in register:", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const authToken = token({
            id: user.id,
            role: user.role,
            time: "7d",
        });

        res.cookie("token", authToken, getCookieOptions(req));

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
            token: authToken,
        });
    } catch (error: any) {
        console.error("Error in login:", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        const { maxAge, ...clearOptions } = getCookieOptions(req);
        res.clearCookie("token", clearOptions);
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error: any) {
        console.error("Error in logout:", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

export const Getprofile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User not identified" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Success", data: user });
    } catch (error: any) {
        console.error("Error in getprofile:", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};