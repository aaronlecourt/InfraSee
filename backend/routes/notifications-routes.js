import express from "express";
import { getUserNotifications, markNotificationAsRead  } from "../controllers/notifications-controller.js";
import { protect } from "../middleware/auth-middleware.js";


const router = express.Router();

router.route("/notifications").get(protect, getUserNotifications);
router.route("/notifications/:id/read").put(protect, markNotificationAsRead);

export default router;
