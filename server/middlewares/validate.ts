import type { Request, Response, NextFunction } from "express";
import {type ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = await schema.parseAsync(req.body);
            req.body = parsed;
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                });
            }
            return res.status(400).json({ message: "Invalid request payload" });
        }
    };
};
