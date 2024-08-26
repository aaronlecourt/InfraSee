import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user-model.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Authorization failed: The token provided is invalid.");
    }
  } else {
    res.status(401);
    throw new Error("Authorization required: No token provided.");
  }
});

const admin = asyncHandler(async (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error(
        "Access denied: Admin privileges are required to access this resource."
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(
      "An unexpected error occurred while verifying admin privileges."
    );
  }
});

const moderator = asyncHandler(async (req, res, next) => {
  try {
    if (req.user && req.user.isModerator) {
      next();
    } else {
      res.status(401);
      throw new Error(
        "Access denied: Moderator privileges are required to access this resource."
      );
    }
  } catch (error) {
    res.status(500);
    throw new Error(
      "An unexpected error occurred while verifying moderator privileges."
    );
  }
});

export { protect, admin, moderator };
