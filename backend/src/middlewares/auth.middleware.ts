// import type { Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";
// import dotenv from "dotenv";
// import type { NextFunction } from "express";
// dotenv.config();

// export const isAuthenticated = async (req : Request, res : Response, next:NextFunction): Promise<void> => {
//     try {
//         const token = req.header('Authorization')?.replace('Bearer ', '');
//         if (!token) {
//             return res.status(401).json({ message: 'No token provided' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id).select('-password');
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid token' });
//         }

//         req.user = user;
//         next();

//     } catch (error) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
// }       