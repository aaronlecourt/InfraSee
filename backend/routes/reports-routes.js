import express from "express";
import { 
    getReports, 
    getModeratorReports,
    archiveReport,
    getModeratorArchivedReports,
    getArchivedReports,
    restoreReport,
    deleteReport,
    createReport,
    updateReportStatus,
    getUnassignedReports,
    updateOnAccept,
    markReportAsSeen
 } from "../controllers/reports-controller.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.route('/').get(getReports);
router.post("/create", createReport);
router.route('/unassigned').get(protect, getUnassignedReports);
router.route('/moderator/reports').get(protect, getModeratorReports);
router.route('/moderator/archived/reports').get(protect, getModeratorArchivedReports);
router.route('/archived/reports').get(protect, getArchivedReports);
router.route('/seen/:id').put(protect, markReportAsSeen);
router.route('/archive/:id').put(archiveReport);
router.route('/restore/:id').put(restoreReport);
router.route('/delete/:id').delete(deleteReport);
router.route('/status/:id').put(updateReportStatus);
router.route('/accept/:id').put(protect, updateOnAccept);

export default router;
