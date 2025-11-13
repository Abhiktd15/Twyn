import express, { Router } from 'express'
import { followUser, getCurrentUser, getUserProfile, login, register, updateProfile } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router()

router.post("/new",register)
router.post("/login",login)
router.get("/profile/:username", getUserProfile);

router.use(isAuthenticated)
router.get("/me",getCurrentUser);
router.put("/profile", updateProfile);
router.post("/follow/:targetUserId", followUser);


export default router