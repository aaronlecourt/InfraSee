import asyncHandler from "express-async-handler";
import Report from "../models/reports-model.js";
import User from "../models/user-model.js";

const getReports = asyncHandler(async (req, res) => {
  try {
    const reports = await Report.find({ is_archived: false })
      .populate("report_mod", "name")
      .populate("report_status", "stat_name");

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

    // Check if reports were found
    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "No reports found for this moderator." });
    }

    res.json(reports);
  } catch (error) {
    console.error(`Error fetching moderator reports: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report or user ID format." });
    } else if (error.name === "ValidationError") {
      res.status(422).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error. Please try again later." });
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
      .populate("report_status", "stat_name");

    // Return an empty array if no reports are found, but with status 200
    if (!reports || reports.length === 0) {
      return res.status(200).json([]); // Return empty array with 200 OK
    }

    res.json(reports); // Send the reports as the response
  } catch (error) {
    console.error(`Error fetching moderator archived reports: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid report or user ID format." });
    } else if (error.name === "ValidationError") {
      res.status(422).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error. Please try again later." });
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
      .populate("report_status", "stat_name");

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

    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid report ID format.' });
    } else {
      res.status(500).json({ message: 'Server error. Please try again later.' });
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

    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid report ID format.' });
    } else {
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  }
});

const updateReportStatus = asyncHandler(async (req, res) => {
  try {
    const reportId = req.params.id;
    const { report_status } = req.body;

    // Find the report by ID and update the status
    const report = await Report.findByIdAndUpdate(
      reportId,
      { report_status },
      { new: true } // Return the updated report
    );

    if (!report) {
      res.status(404);
      throw new Error("Report not found.");
    }

    res.json({ message: "Report status updated successfully", report });
  } catch (error) {
    console.error(`Error updating report status: ${error.message}`);

    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid report ID format.' });
    } else {
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  }
});


export { 
  getReports, 
  getModeratorReports, 
  getModeratorArchivedReports,
  archiveReport, 
  getArchivedReports,
  restoreReport,
  deleteReport,
  updateReportStatus,
 };
