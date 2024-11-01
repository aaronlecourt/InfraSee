import Notification from "../models/notifications-model.js";
import User from "../models/user-model.js";
import asyncHandler from "express-async-handler";

// Notification Service to handle notification creation
const notifyModeratorOnNewReport = asyncHandler(async (report) => {
    // Find moderators that match the infraType of the report
    const moderators = await User.find({
      infra_type: report.infraType,
      isModerator: true,
      deactivated: false,
    });
  
    // Create notifications for each matching moderator
    for (const moderator of moderators) {
      const notification = new Notification({
        user: moderator._id,
        report: report._id,
        message: `New report submitted: ${report.report_desc}`,
        notification_type: "newReport",
      });
      await notification.save();
    }
  });

// Notify submoderators when report status changes to 'Pending Confirmation'
const notifySubmoderatorOnStatusChange = asyncHandler(async (report) => {
  if (report.is_requested) {
    const subModerators = await User.find({
      assignedModerator: report.report_mod,
      isSubModerator: true,
    });

    for (const subModerator of subModerators) {
      const notification = new Notification({
        user: subModerator._id,
        report: report._id,
        message: `A report is awaiting confirmation: ${report.report_desc}`,
        notification_type: "reportStatusChange",
      });
      await notification.save();
    }
  }
});

const notifyModeratorOnSubmodAction = asyncHandler(async (report, isApproved, submodName) => {
  const message = isApproved
    ? `The report "${report.report_desc}" has been approved by ${submodName}.`
    : `The report "${report.report_desc}" was rejected by ${submodName}.`;

  const notification = new Notification({
    user: report.report_mod, // Assuming `report_mod` is the moderator's ID
    report: report._id,
    message,
    notification_type: isApproved ? "reportApproval" : "reportRejection",
  });
  await notification.save();
});
// Fetch notifications for a user
const getUserNotifications = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).populate("report");
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
});

// Mark notification as read
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark notification as read." });
  }
});

// Delete a notification
const deleteNotification = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete notification." });
  }
});

// Mark notification as unread
const markNotificationAsUnread = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;

  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { is_read: false },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark notification as unread." });
  }
});

export {
  notifyModeratorOnNewReport,
  notifySubmoderatorOnStatusChange,
  notifyModeratorOnSubmodAction,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  markNotificationAsUnread
};
