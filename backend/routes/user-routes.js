import express from "express";
import {
  registerUser,
  createSubModerator,
  authUser,
  adminUser,
  moderatorUser,
  subModeratorUser,
  deleteUser,
  deactivateModerator,
  reactivateModerator,
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

router.route("/").post(registerUser);
router.route('/:moderatorId/submoderators').post(protect, createSubModerator);
router.route('/:moderatorId/deactivate').put(protect, deactivateModerator);
router.route('/:moderatorId/reactivate').put(protect, reactivateModerator);
router.route("/delete/:id").delete(deleteUser);
router.route("/auth").post(authUser);
router.route("/auth/admin").post(adminUser);
router.route("/auth/moderator").post(moderatorUser);
router.route("/auth/submoderator").post(subModeratorUser);
router.route("/logout").post(logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/verify-otp").post(verifyOtp);
router.route("/password-reset/request").post(requestPasswordReset);
router.route("/password-reset").post(resetPassword);
router.route("/moderators").get(getModerators);
router.route("/check-email/:email").get(checkEmailExists);

export default router;
