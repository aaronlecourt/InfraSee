import express from "express";
import {
  registerUser,
  createSubModerator,
  authUser,
  adminUser,
  moderatorUser,
  deleteUser,
  deactivateModerator,
  reactivateModerator,
  getDeactivatedUsers,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getModerators,
  getModeratorList,
  getSubModeratorList,
  checkEmailExists,
} from "../controllers/user-controller.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.route("/").post(registerUser);
router.route('/:moderatorId/submoderators').post(protect, createSubModerator);
router.route('/:moderatorId/deactivate').put(protect, deactivateModerator);
router.route('/:moderatorId/reactivate').put(protect, reactivateModerator);
router.route("/deactivated").get(getDeactivatedUsers);
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
router.route("/moderators-list").get(getModeratorList);
router.route("/submoderators-list").get(getSubModeratorList);
router.route("/check-email/:email").get(checkEmailExists);

export default router;
