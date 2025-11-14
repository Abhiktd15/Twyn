import express from "express";
import { createComment, deleteComment, getComments } from "../controllers/comment.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";


const router = express.Router();

// public routes
router.get("/post/:postId", getComments);
router.use(isAuthenticated)
router.post("/post/:postId",createComment);
router.delete("/:commentId", deleteComment);

export default router;