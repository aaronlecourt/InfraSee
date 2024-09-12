import asyncHandler from "express-async-handler";
import Report from "../models/reports-model.js";

const getReports = asyncHandler(async (req, res) => {
  try {
    const reports = await Report.find({});
    res.json(reports);
  } catch (error) {
    console.log(error);
  }
});

export { getReports };
