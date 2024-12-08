import express from "express";
import { getUserNotifications, markNotificationAsRead, deleteNotification, markNotificationAsUnread, notifyModeratorOnTransferredReport  } from "../controllers/notifications-controller.js";
import { protect } from "../middleware/auth-middleware.js";


const router = express.Router();

router.route("/notifications").get(protect, getUserNotifications);
router.route("/notifications/:id/read").put(protect, markNotificationAsRead);
router.route("/notifications/:id/delete").delete(protect, deleteNotification);
router.route("/notifications/:id/unread").put(protect, markNotificationAsUnread);
router.route("/notifications/transferred-report").post(protect, notifyModeratorOnTransferredReport);
export default router;
