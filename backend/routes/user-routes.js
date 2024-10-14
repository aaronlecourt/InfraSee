import express from "express";
import {
  registerUser,
  authUser,
  adminUser,
  moderatorUser,
  deleteUser,
  // refreshToken,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getModerators,
  checkEmailExists,
} from "../controllers/user-controller.js";
import { protect } from "../middleware/auth-middleware.js";
// import { refreshToken } from "../middleware/refresh-token-middleware.js";

const router = express.Router();

router.route("/").post(registerUser);
router.route("/delete/:id").delete(deleteUser);
router.route("/auth").post(authUser);
router.route("/auth/admin").post(adminUser);
router.route("/auth/moderator").post(moderatorUser);
router.route("/logout").post(logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/verify-otp").post(verifyOtp);
router.route("/password-reset/request").post(requestPasswordReset);
router.route("/password-reset").post(resetPassword);
router.route("/change-password").put(protect, changePassword);
router.route("/moderators").get(getModerators);
router.route("/check-email/:email").get(checkEmailExists);

export default router;
