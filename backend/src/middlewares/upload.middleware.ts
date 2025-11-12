import multer from "multer";
import type { FileFilterCallback } from "multer";
import type { Request } from "express";

// Configure in-memory storage
const storage = multer.memoryStorage();

// File filter with proper type annotations
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
};

// Configure upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
