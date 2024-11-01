import asyncHandler from "express-async-handler";
import Report from "../models/reports-model.js";
import User from "../models/user-model.js";
import Status from "../models/status-model.js";
import Notification from "../models/notifications-model.js";
import {
  notifySubmoderatorOnStatusChange,
  notifyModeratorOnNewReport,
  notifyModeratorOnSubmodAction,
} from "./notifications-controller.js";

const createReport = asyncHandler(async (req, res) => {
  try {
    const {
      report_address,
      latitude,
      longitude,
      infraType,
      report_by,
      report_contactNum,
      report_desc,
      report_img,
    } = req.body;

    // Input validation
    if (
      !report_address ||
      !latitude ||
      !longitude ||
      !infraType ||
      !report_by ||
      !report_contactNum ||
      !report_desc ||
      !report_img
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Haversine distance function
    const haversineDistance = (coords1, coords2) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const lat1 = coords1[0],
        lon1 = coords1[1],
        lat2 = coords2[0],
        lon2 = coords2[1];
      const R = 6371e3; // Earth radius in meters
      const φ1 = toRad(lat1),
        φ2 = toRad(lat2);
      const Δφ = toRad(lat2 - lat1),
        Δλ = toRad(lon2 - lon1);

      const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in meters
    };

    // Check for existing reports within 10 meters or at the same location
    const existingReports = await Report.find({ infraType }).populate(
      "report_status"
    );
    for (const report of existingReports) {
      const distance = haversineDistance(
        [latitude, longitude],
        [report.latitude, report.longitude]
      );

      // Check if the distance is less than or equal to 10 meters
      if (distance <= 10 && report.report_status.stat_name !== "Resolved") {
        return res.status(409).json({
          message: "A similar report has already been reported.",
          // existingReport: `Address: ${report.report_address}, Description: ${report.report_desc}, Status: ${report.report_status.stat_name}`,
        });
      }
    }

    // Create and save the new report
    const report = new Report({
      report_address,
      latitude,
      longitude,
      infraType,
      report_by,
      report_contactNum,
      report_desc,
      report_img,
    });

    const savedReport = await report.save();

    // Notify relevant moderators
    await notifyModeratorOnNewReport(savedReport);

    return res
      .status(201)
      .json({ message: "Report created successfully", report: savedReport });
  } catch (error) {
    console.error(`Error creating report: ${error.message}`);

    if (error.name === "ValidationError") {
      return res
        .status(422)
        .json({ message: "Validation error: " + error.message });
    } else if (error.code === 11000) {
      return res.status(409).json({ message: "Duplicate report found." });
    } else {
      return res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

const updateOnAccept = asyncHandler(async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user._id;

    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        report_mod: userId,
        report_status: "66d258f9baae7f52f54793f4",
        is_new: true,
      },
      { new: true }
    )
      .populate("report_mod", "name")
      .populate("report_status", "stat_name");

    if (!report) {
      res.status(404);
      throw new Error("Report not found.");
    }

    res.json({ message: "Report updated successfully", report });
  } catch (error) {
    console.error(`Error updating report: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report ID format." });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

const getUnassignedReports = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    // Check if user ID is present
    if (!userId) {
      res.status(400);
      throw new Error("User ID is missing in the request.");
    }

    // Fetch the user to get the assigned infrastructure type
    const user = await User.findById(userId).select("infra_type");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const assignedInfraType = user.infra_type;

    // Fetch reports that are not assigned to any moderator, not hidden, and match the user's infrastructure type
    const reports = await Report.find({
      report_mod: null,
      is_hidden: false,
      infraType: assignedInfraType,
    })
      .populate("report_mod", "name")
      .populate("report_status", "stat_name")
      .populate("infraType", "infra_name");

    if (!reports || reports.length === 0) {
      return res.status(200).json([]); // Return empty array with 200 OK
    }

    // Filter reports to include only those with a status name of "Unassigned"
    const unassignedReports = reports.filter(
      (report) => report.report_status.stat_name === "Unassigned"
    );

    // Return the reports, even if empty
    res.json(unassignedReports);
  } catch (error) {
    console.error(`Error fetching unassigned reports: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report or user ID format." });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

const getReports = asyncHandler(async (req, res) => {
  try {
    const reports = await Report.find({ is_hidden: false })
      .populate("report_mod", "name")
      .populate("report_status", "stat_name")
      .populate("infraType", "infra_name");

    res.json(reports);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

const getModeratorReports = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      res.status(400);
      throw new Error("User ID is missing in the request.");
    }

    // Ensure the user is a moderator
    const user = await User.findById(userId);
    if (!user || !user.isModerator) {
      res.status(403);
      throw new Error("Access denied: User is not a moderator.");
    }

    // Fetch reports assigned to the moderator
    const reports = await Report.find({
      report_mod: userId,
      is_hidden: false,
    })
      .populate("report_mod", "name")
      .populate("report_status", "stat_name");

    // Return an empty array if no reports are found, but with status 200
    if (!reports || reports.length === 0) {
      return res.status(200).json([]); // Return empty array with 200 OK
    }

    // Sort reports: unread first, then by status
    const statusOrder = [
      "Pending",
      "For Revision",
      "In Progress",
      "Under Review",
      "Resolved",
      "Dismissed",
    ];

    const sortedReports = reports.sort((a, b) => {
      const aIsNew = a.is_new; // Unread report check
      const bIsNew = b.is_new; // Unread report check

      // Prioritize unread reports
      if (aIsNew && !bIsNew) return -1; // a comes first
      if (!aIsNew && bIsNew) return 1; // b comes first

      // For reports that are both read or both unread, sort by status
      return (
        statusOrder.indexOf(a.report_status.stat_name) -
        statusOrder.indexOf(b.report_status.stat_name)
      );
    });

    res.json(sortedReports); // Send the sorted reports as the response
  } catch (error) {
    console.error(`Error fetching moderator reports: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report or user ID format." });
    } else if (error.name === "ValidationError") {
      res.status(422).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

const getModeratorHiddenReports = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      res.status(400);
      throw new Error("User ID is missing in the request.");
    }

    // Ensure the user is a moderator
    const user = await User.findById(userId);
    if (!user || !user.isModerator) {
      res.status(403);
      throw new Error("Access denied: User is not a moderator.");
    }

    // Fetch hidden reports assigned to the moderator
    const reports = await Report.find({
      report_mod: userId,
      is_hidden: true,
    })
      .populate("report_mod", "name")
      .populate("report_status", "stat_name")
      .populate("infraType", "infra_name");

    if (!reports || reports.length === 0) {
      return res.status(200).json([]);
    }

    res.json(reports);
  } catch (error) {
    console.error(`Error fetching moderator hidden reports: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report or user ID format." });
    } else if (error.name === "ValidationError") {
      res.status(422).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

const getSubModeratorReports = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      res.status(400);
      throw new Error("User ID is missing in the request.");
    }

    // Find the logged-in user
    const user = await User.findById(userId).populate("assignedModerator");
    if (!user || !user.isSubModerator) {
      res.status(403);
      throw new Error("Access denied: User is not a submoderator.");
    }

    // Ensure the submoderator has an assigned moderator
    if (!user.assignedModerator) {
      res.status(400);
      throw new Error("Submoderator does not have an assigned moderator.");
    }

    // Fetch the ID for "Under Review" status
    const underReviewStatus = await Status.findOne({
      stat_name: "Under Review",
    });
    if (!underReviewStatus) {
      return res
        .status(404)
        .json({ message: "Under Review status not found." });
    }

    // Fetch reports assigned to the assigned moderator with "Under Review" status
    const reports = await Report.find({
      report_mod: user.assignedModerator._id,
      report_status: underReviewStatus._id, // Use the status ID
      is_hidden: false,
    })
      .populate("report_mod", "name")
      .populate("report_status", "stat_name");

    if (!reports || reports.length === 0) {
      return res.status(200).json([]); // Return empty array with 200 OK
    }

    res.status(200).json(reports);
  } catch (error) {
    console.error(`Error fetching submoderator reports: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report or user ID format." });
    } else if (error.name === "ValidationError") {
      res.status(422).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

const getSubModeratorHiddenReports = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      res.status(400);
      throw new Error("User ID is missing in the request.");
    }

    // Find the logged-in user
    const user = await User.findById(userId);
    if (!user || !user.isSubModerator) {
      res.status(403);
      throw new Error("Access denied: User is not a submoderator.");
    }

    // Ensure the submoderator has an assigned moderator
    if (!user.assignedModerator) {
      res.status(400);
      throw new Error("Submoderator does not have an assigned moderator.");
    }

    // Fetch hidden reports assigned to the assigned moderator of this submoderator
    const hiddenReports = await Report.find({
      report_mod: user.assignedModerator,
      is_hidden: true,
    })
      .populate("report_mod", "name")
      .populate("report_status", "stat_name")
      .populate("infraType", "infra_name");

    if (!hiddenReports || hiddenReports.length === 0) {
      return res.status(200).json([]); // Return empty array with 200 OK
    }

    res.json(hiddenReports);
  } catch (error) {
    console.error(
      `Error fetching submoderator hidden reports: ${error.message}`
    );

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report or user ID format." });
    } else if (error.name === "ValidationError") {
      res.status(422).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

const hideReport = asyncHandler(async (req, res) => {
  try {
    const reportIds = req.params.ids.split(","); // Assuming IDs are passed as a comma-separated string

    // Update multiple reports
    const reports = await Report.updateMany(
      { _id: { $in: reportIds } }, // Match any report with an ID in the array
      { is_hidden: true, hidden_at: new Date() }
    );

    if (reports.nModified === 0) {
      return res.status(404).json({ message: "No reports found to hide." });
    }

    res.json({
      message: "Reports hidden successfully",
      count: reports.nModified,
    });
  } catch (error) {
    console.error(`Error hiding reports: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report ID format." });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

const restoreReport = asyncHandler(async (req, res) => {
  try {
    const reportIds = req.params.ids.split(","); // Assuming IDs are passed as a comma-separated string

    // Update multiple reports
    const reports = await Report.updateMany(
      { _id: { $in: reportIds } }, // Match any report with an ID in the array
      { is_hidden: false, hidden_at: null }
    );

    if (reports.nModified === 0) {
      return res.status(404).json({ message: "No reports found to restore." });
    }

    res.json({
      message: "Reports restored successfully",
      count: reports.nModified,
    });
  } catch (error) {
    console.error(`Error restoring reports: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report ID format." });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

const getHiddenReports = asyncHandler(async (req, res) => {
  try {
    const reports = await Report.find({ is_hidden: true })
      .populate("report_mod", "name")
      .populate("report_status", "stat_name")
      .populate("infraType", "infra_name");

    res.json(reports);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

const deleteReport = asyncHandler(async (req, res) => {
  try {
    const reportId = req.params.id;

    // Find the report by ID and delete it
    const report = await Report.findByIdAndDelete(reportId);

    if (!report) {
      res.status(404);
      throw new Error("Report not found.");
    }

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error(`Error deleting report: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report ID format." });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

const updateReportStatus = async (req, res) => {
  const reportId = req.params.id;
  const {
    report_status: statusId,
    modID: modId,
    status_remark,
    report_time_resolved,
  } = req.body; // Updated destructuring

  try {
    // Find the report
    const report = await Report.findById(reportId).populate("report_mod");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Find the moderator who is updating the report
    const moderator = await User.findById(modId).populate("subModerators");
    if (!moderator) {
      return res.status(404).json({ message: "Moderator not found" });
    }

    // Find the resolved and Under Review status
    const resolvedStatus = await Status.findOne({ stat_name: "Resolved" });
    const underReviewStatus = await Status.findOne({
      stat_name: "Under Review",
    });
    const unassignedStatus = await Status.findOne({ stat_name: "Unassigned" });

    // Prepare update data for report
    const updateData = {
      report_status: statusId,
      status_remark,
      is_new: true,
      request_time: null,
      report_time_resolved: report_time_resolved,
    };

    // Check if the status is being set to "Resolved"
    if (statusId === resolvedStatus._id.toString()) {
      // Check if the moderator has submoderators
      if (moderator.subModerators.length > 0) {
        // If moderator has submoderators, set status to "Under Review" and is_requested to true
        updateData.report_status = underReviewStatus._id;
        updateData.is_requested = true;
        updateData.request_time = Date.now();
      } else {
        // If no submoderators, set the status to "Resolved"
        updateData.report_status = resolvedStatus._id;
        updateData.is_requested = false;
        updateData.request_time = null;
        updateData.report_time_resolved = resolvedStatus.report_time_resolved;
      }
    }

    // Check if the status is being set to "Unassigned"
    if (statusId === unassignedStatus._id.toString()) {
      // If the status is "Unassigned", clear the assigned moderator
      await Report.findByIdAndUpdate(reportId, { $unset: { report_mod: "" } });
    }

    // Update the report with new status and information
    const updatedReport = await Report.findByIdAndUpdate(reportId, updateData, {
      new: true,
    });

    // Notify submoderators if the report status is requested
    await notifySubmoderatorOnStatusChange(updatedReport);

    // Return success response
    res.status(200).json({
      message: "Report status updated successfully",
      report: updatedReport,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

const submodApproval = async (req, res) => {
  const reportId = req.params.id;
  const { isAccepted } = req.body; // submoderator will pass true/false for isAccepted
  const userId = req.user._id;

  try {
    // Find the logged-in user to check if they are a submoderator
    const user = await User.findById(userId);
    if (!user || !user.isSubModerator) {
      return res
        .status(403)
        .json({ message: "Access denied: User is not a submoderator." });
    }

    // Find the report
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const resolvedStatus = await Status.findOne({ stat_name: "Resolved" });

    if (report.is_requested && isAccepted) {
      // Submoderator approves the report
      report.is_approved = true;
      report.report_status = resolvedStatus._id;
      report.is_requested = false;
      report.is_new = true; // Optionally reset the "new" flag
      await report.save();

      // Notify moderator on submoderator approval
      await notifyModeratorOnSubmodAction(report, true, user.name);

      res.status(200).json({ message: "Report approval processed", report });
    } else {
      // If rejected or not approved, keep as pending or modify based on your requirements
      return res
        .status(400)
        .json({ message: "Report not approved by submoderator" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

const submodReject = async (req, res) => {
  const reportId = req.params.id;
  const { isAccepted } = req.body; // submoderator will pass true/false for isAccepted
  const userId = req.user._id;

  try {
    // Find the logged-in user to check if they are a submoderator
    const user = await User.findById(userId);
    if (!user || !user.isSubModerator) {
      return res
        .status(403)
        .json({ message: "Access denied: User is not a submoderator." });
    }

    // Find the report
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const forRevisionStatus = await Status.findOne({
      stat_name: "For Revision",
    });

    if (report.is_requested && !isAccepted) {
      // Submoderator rejects the report
      report.is_approved = false;
      report.report_status = forRevisionStatus._id;
      report.is_requested = false; // Set to false since it's no longer requested
      report.is_new = true; // Optionally reset the "new" flag
      await report.save();

      // Notify moderator on submoderator rejection
      await notifyModeratorOnSubmodAction(report, false, user.name);

      res.status(200).json({ message: "Report rejection processed", report });
    } else {
      return res
        .status(400)
        .json({ message: "Report not rejected by submoderator" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

const markReportAsSeen = asyncHandler(async (req, res) => {
  try {
    const reportId = req.params.id;
    console.log(`Attempting to mark report as seen with ID: ${reportId}`);

    const report = await Report.findByIdAndUpdate(
      reportId,
      { is_new: false },
      { new: true }
    )
      .populate("report_mod", "name")
      .populate("report_status", "stat_name")
      .populate("infraType", "infra_name");

    if (!report) {
      res.status(404);
      throw new Error("Report not found.");
    }

    res.json({ message: "Report marked as seen successfully", report });
  } catch (error) {
    if (error.name === "CastError") {
      console.error(`Invalid report ID format: ${reportId}`);
      res.status(400).json({ message: "Invalid report ID format." });
    } else {
      console.error(`Error marking report as seen: ${error.message}`);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

const markAsRead = asyncHandler(async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    if (!report.is_new) {
      return res
        .status(200)
        .json({ message: "Report is already marked as read." });
    }

    report.is_new = false;
    const updatedReport = await report.save();

    res.json({
      message: "Report marked as read successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error(`Error marking report as read: ${error.message}`);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

const markAsUnread = asyncHandler(async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    if (report.is_new) {
      return res
        .status(200)
        .json({ message: "Report is already marked as unread." });
    }

    report.is_new = true;
    const updatedReport = await report.save();

    res.json({
      message: "Report marked as unread successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error(`Error marking report as unread: ${error.message}`);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

export {
  createReport,
  getReports,
  getModeratorReports,
  getModeratorHiddenReports,
  getSubModeratorReports,
  getSubModeratorHiddenReports,
  hideReport,
  getHiddenReports,
  restoreReport,
  deleteReport,
  updateReportStatus,
  submodApproval,
  submodReject,
  getUnassignedReports,
  updateOnAccept,
  markReportAsSeen,
  markAsRead,
  markAsUnread,
};
