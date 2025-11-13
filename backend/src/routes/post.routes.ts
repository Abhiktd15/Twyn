import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { createPost, getPost, getPosts, getUserPosts } from "../controllers/post.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// public routes
router.get("/", getPosts);
router.get("/:postId", getPost);
router.get("/user/:username", getUserPosts);

router.use(isAuthenticated)
router.post("/", upload.single("image"), createPost);
// router.post("/:postId/like", protectRoute, likePost);
// router.delete("/:postId", protectRoute, deletePost);

export default router;