import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { deleteNotification, getNotifications } from "../controllers/notification.controller.js";
const router = express.Router();

router.use(isAuthenticated)
router.get("/", getNotifications);
router.delete("/:notificationId", deleteNotification);

export default router;