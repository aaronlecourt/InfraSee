import express from "express";
import { 
    getReports, 
    getModeratorReports,
    archiveReport,
    getModeratorArchivedReports,
    getArchivedReports,
    restoreReport
 } from "../controllers/reports-controller.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.route('/').get(getReports);
router.route('/moderator/reports').get(protect, getModeratorReports);
router.route('/moderator/archived/reports').get(protect, getModeratorArchivedReports);
router.route('/archived/reports').get(protect, getArchivedReports);
router.route('/archive/:id').put(archiveReport);
router.route('/restore/:id').put(restoreReport);

export default router;
