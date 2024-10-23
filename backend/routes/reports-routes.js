import express from "express";
import {
  getReports,
  getArchivedReports,
  getModeratorReports,
  getModeratorArchivedReports,
  getSubModeratorReports,
  getSubModeratorArchivedReports,
  archiveReport,
  restoreReport,
  deleteReport,
  createReport,
  updateReportStatus,
  submodApproval,
  submodReject,
  getUnassignedReports,
  updateOnAccept,
  markReportAsSeen,
  markAsRead,
  markAsUnread,
} from "../controllers/reports-controller.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.route("/").get(getReports);
router.post("/create", createReport);
router.route("/unassigned").get(protect, getUnassignedReports);
router.route("/moderator/reports").get(protect, getModeratorReports);
router
  .route("/moderator/archived/reports")
  .get(protect, getModeratorArchivedReports);
router.route("/submoderator/reports").get(protect, getSubModeratorReports);
router
  .route("/submoderator/reports/archived")
  .get(protect, getSubModeratorArchivedReports);
router.route("/archived/reports").get(protect, getArchivedReports);
router.route("/seen/:id").put(protect, markReportAsSeen);
router.put("/read/:id", markAsRead);
router.put("/unread/:id", markAsUnread);
router.route("/archive/:id").put(archiveReport);
router.route("/restore/:id").put(restoreReport);
router.route("/delete/:id").delete(deleteReport);
router.route("/status/:id").put(protect, updateReportStatus);
router.route("/approval/:id").put(protect, submodApproval); 
router.route("/reject/:id").put(protect, submodReject);
router.route("/accept/:id").put(protect, updateOnAccept);

export default router;
