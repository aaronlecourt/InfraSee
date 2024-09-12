import express from "express";
import {
  registerUser,
  authUser,
  adminUser,
  moderatorUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  getModerators,
  checkEmailExists,
} from "../controllers/user-controller.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/auth/admin", adminUser);
router.post("/auth/moderator", moderatorUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.post('/verify-otp', verifyOtp);
router.post("/password-reset/request", requestPasswordReset);
router.post("/password-reset", resetPassword);
router.get("/moderators", getModerators);
router.get("/check-email/:email", checkEmailExists);

export default router;
