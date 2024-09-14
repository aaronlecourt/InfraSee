import asyncHandler from "express-async-handler";
import Status from "../models/status-model.js";

const getStatus = asyncHandler(async (req, res) => {
  try {
    const status = await Status.find({});
    res.json(status);
  } catch (error) {
    console.log(error);
  }
});

export { getStatus };
