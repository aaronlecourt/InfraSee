import express from "express";
import {
  getReports,
  getHiddenReports,
  getModeratorReports,
  getModeratorHiddenReports,
  getSubModeratorReports,
  getSubModeratorHiddenReports,
  hideReport,
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
  markAsReadSub,
  markAsUnreadSub,
} from "../controllers/reports-controller.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.route("/").get(getReports);
// Add the 'protect' middleware to the route to secure it
router.route("/create").post((req, res) => createReport(req, res, req.app.get('io')));
router.route("/unassigned").get(protect, getUnassignedReports);
router.route("/moderator/reports").get(protect, getModeratorReports);
router
  .route("/moderator/hidden/reports")
  .get(protect, getModeratorHiddenReports);
router.route("/submoderator/reports").get(protect, getSubModeratorReports);
router
  .route("/submoderator/reports/hidden")
  .get(protect, getSubModeratorHiddenReports);
router.route("/hidden/reports").get(protect, getHiddenReports);
router.route("/seen/:id").put(protect, markReportAsSeen);
router.put("/read/:id", markAsRead);
router.put("/unread/:id", markAsUnread);
router.put("/read/sub/:id", markAsReadSub);
router.put("/unread/sub/:id", markAsUnreadSub);
router.route("/hide/:ids").put(protect, hideReport);
router.route("/restore/:ids").put(protect, restoreReport);
router.route("/delete/:id").delete(deleteReport);
router.route("/status/:id").put(protect, (req, res) => updateReportStatus(req, res, req.app.get('io')));
router.route("/approval/:id").put(protect, (req, res) => submodApproval(req, res, req.app.get('io')));
router.route("/reject/:id").put(protect, submodReject);
router.route("/accept/:id").put(protect, (req, res) => updateOnAccept(req, res, req.app.get('io')));


export default router;
