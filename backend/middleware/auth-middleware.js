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

const authorize = (checkFn, errorMessage) =>
  asyncHandler(async (req, res, next) => {
    if (checkFn(req.user)) {
      next();
    } else {
      res.status(401);
      throw new Error(errorMessage);
    }
  });

const admin = authorize(
  (user) => user?.isAdmin,
  "Access denied: Admin privileges are required to access this resource."
);

// const moderator = authorize(
//   (user) => user?.isModerator,
//   "Access denied: Moderator privileges are required to access this resource."
// );

// const mainModerator = authorize(
//   (user) => user?.isModerator && user?.can_create,
//   "Access denied: Main moderator privileges are required to access this resource."
// );


export { protect, admin };
