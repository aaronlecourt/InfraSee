import express from "express";
import { getReports } from "../controllers/reports-controller.js";

const router = express.Router();

router.route('/').get(getReports);

export default router;
