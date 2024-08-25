import express from "express";
import {
  authUser,
  adminUser,
  moderatorUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user-controller.js";
import { protect, } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/auth/admin", adminUser);
router.post("/auth/moderator", moderatorUser);
router.post("/logout", logoutUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile);

export default router;
