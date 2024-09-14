import express from "express";
import { getStatus } from "../controllers/status-controller.js";

const router = express.Router();

router.route('/').get(getStatus);

export default router;
