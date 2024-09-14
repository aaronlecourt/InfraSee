import asyncHandler from "express-async-handler";
import Report from "../models/reports-model.js";

const getReports = asyncHandler(async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate('report_mod', 'name')
      .populate('report_status', 'stat_name');

    res.json(reports);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export { getReports };
