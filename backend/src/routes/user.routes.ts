import express, { Router } from 'express'
import { getUserProfile, register } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router()

router.post("/new",register)

router.use(isAuthenticated)
router.get("/profile/:username", getUserProfile);

// // protected routes
// router.post("/sync", protectRoute, syncUser);
// router.get("/me", protectRoute, getCurrentUser);
// router.put("/profile", protectRoute, updateProfile);
// router.post("/follow/:targetUserId", protectRoute, followUser);

export default router