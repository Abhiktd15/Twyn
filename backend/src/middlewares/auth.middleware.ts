import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

interface JwtPayload {
    id: string;
}

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.header("Authorization");
        const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : undefined;

        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return; 
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }

        (req as any).user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
