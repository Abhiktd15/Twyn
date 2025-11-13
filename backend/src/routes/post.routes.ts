import express from "express";
import { createPost, deletePost, getPostByID, getPosts, getUserPosts, likePost } from "../controllers/post.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// public routes
router.get("/", getPosts);
router.get("/:postId", getPostByID);
router.get("/user/:username", getUserPosts);

router.use(isAuthenticated)
router.post("/", upload.single("image"), createPost);
router.post("/:postId/like",likePost);
router.delete("/:postId/delete", deletePost);

export default router;