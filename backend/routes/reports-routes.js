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
    getUnassignedReports
 } from "../controllers/reports-controller.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.route('/').get(getReports);
router.post("/create", createReport);
router.get('/unassigned', getUnassignedReports);
router.route('/moderator/reports').get(protect, getModeratorReports);
router.route('/moderator/archived/reports').get(protect, getModeratorArchivedReports);
router.route('/archived/reports').get(protect, getArchivedReports);
router.route('/archive/:id').put(archiveReport);
router.route('/restore/:id').put(restoreReport);
router.route('/delete/:id').delete(deleteReport);
router.route('/status/:id').put(updateReportStatus);

export default router;
