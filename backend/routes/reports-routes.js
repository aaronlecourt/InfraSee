import express from "express";
import { getReports, getModeratorReports } from "../controllers/reports-controller.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.route('/').get(getReports);
router.route('/moderator/reports').get(protect, getModeratorReports);

export default router;
