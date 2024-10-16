import asyncHandler from "express-async-handler";
import Report from "../models/reports-model.js";
import User from "../models/user-model.js";
import InfrastructureType from "../models/infrastructureType-model.js";

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
      report_status,
      report_mod,
      report_time_resolved,
      status_remark,
    } = req.body;

    if (
      !report_address ||
      !latitude ||
      !longitude ||
      !infraType ||
      !report_by ||
      !report_contactNum ||
      !report_desc ||
      !report_img ||
      !report_status
    ) {
      res.status(400);
      throw new Error("All fields are required.");
    }

    const report = new Report({
      report_address,
      latitude,
      longitude,
      infraType,
      report_by,
      report_contactNum,
      report_desc,
      report_img,
      report_status,
      report_mod,
      report_time_resolved,
      status_remark,
    });

    const savedReport = await report.save();

    // Populate report_status and infraType after saving
    const populatedReport = await Report.findById(savedReport._id)
      .populate("report_mod", "name")
      .populate("report_status", "stat_name")
      .populate("infraType", "infra_name");

    console.log(populatedReport);
    res.status(201).json({
      message: "Report created successfully",
      report: populatedReport,
    });
  } catch (error) {
    console.error(`Error creating report: ${error.message}`);

    if (error.name === "ValidationError") {
      res.status(422).json({ message: error.message });
    } else {
      res
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

    // Fetch reports that are not assigned to any moderator, not archived, and match the user's infrastructure type
    const reports = await Report.find({
      report_mod: null,
      is_archived: false,
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
    const reports = await Report.find({ is_archived: false })
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
      is_archived: false,
    })
      .populate("report_mod", "name")
      .populate("report_status", "stat_name");

    // Return an empty array if no reports are found, but with status 200
    if (!reports || reports.length === 0) {
      return res.status(200).json([]); // Return empty array with 200 OK
    }

    res.json(reports); // Send the reports as the response
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

const getModeratorArchivedReports = asyncHandler(async (req, res) => {
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

    // Fetch archived reports assigned to the moderator
    const reports = await Report.find({
      report_mod: userId,
      is_archived: true,
    })
      .populate("report_mod", "name")
      .populate("report_status", "stat_name")
      .populate("infraType", "infra_name");

    if (!reports || reports.length === 0) {
      return res.status(200).json([]);
    }

    res.json(reports);
  } catch (error) {
    console.error(
      `Error fetching moderator archived reports: ${error.message}`
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

const archiveReport = asyncHandler(async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { is_archived: true, archived_at: new Date() },
      { new: true }
    );

    if (!report) {
      res.status(404);
      throw new Error("Report not found.");
    }

    res.json({ message: "Report archived successfully", report });
  } catch (error) {
    console.error(`Error archiving report: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report ID format." });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

const getArchivedReports = asyncHandler(async (req, res) => {
  try {
    const reports = await Report.find({ is_archived: true })
      .populate("report_mod", "name")
      .populate("report_status", "stat_name")
      .populate("infraType", "infra_name");

    res.json(reports);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

const restoreReport = asyncHandler(async (req, res) => {
  try {
    const reportId = req.params.id;

    // Find the report and update is_archived to false and clear archived_at field
    const report = await Report.findByIdAndUpdate(
      reportId,
      { is_archived: false, archived_at: null },
      { new: true }
    );

    if (!report) {
      res.status(404);
      throw new Error("Report not found.");
    }

    res.json({ message: "Report restored successfully", report });
  } catch (error) {
    console.error(`Error restoring report: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report ID format." });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
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

const updateReportStatus = asyncHandler(async (req, res) => {
  try {
    const reportId = req.params.id;
    const { report_status, status_remark } = req.body;

    const updateData = {
      report_status,
      status_remark,
      is_new: true,
    };

    console.log(report_status);

    // Check if the status is '66d25911baae7f52f54793f6'
    if (report_status === "66d25911baae7f52f54793f6") {
      await Report.findByIdAndUpdate(reportId, { $unset: { report_mod: "" } });
    }

    const report = await Report.findByIdAndUpdate(reportId, updateData, {
      new: true,
    });

    if (!report) {
      res.status(404);
      throw new Error("Report not found.");
    }

    res.json({ message: "Report status updated successfully", report });
  } catch (error) {
    console.error(`Error updating report status: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report ID format." });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});

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

export {
  createReport,
  getReports,
  getModeratorReports,
  getModeratorArchivedReports,
  archiveReport,
  getArchivedReports,
  restoreReport,
  deleteReport,
  updateReportStatus,
  getUnassignedReports,
  updateOnAccept,
  markReportAsSeen,
};
