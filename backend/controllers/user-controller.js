import asyncHandler from "express-async-handler";
import User from "../models/user-model.js";
import generateToken from "../utils/generate-token.js";
import generateOtp from "../utils/otp-generator.js";
import sendOtpEmail from "../utils/mail.js";

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Private
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isModerator: user.isModerator,
      isSubModerator: user.isSubModerator,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Private
const adminUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Check if user is an admin
    if (!user.isAdmin) {
      res.status(403);
      throw new Error("Access denied: Not an admin");
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isModerator: user.isModerator,
      isSubModerator: user.isSubModerator,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Auth user (Moderator or SubModerator) & get token
// @route   POST /api/users/auth
// @access  Public
const moderatorUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email }).populate("infra_type", "_id infra_name");

  // Check if user exists
  if (!user) {
    res.status(401);
    throw new Error("No registered accounts were found with that email.");
  }

  // Check if user exists, is deactivated, or password is incorrect
  if (!user || user.deactivated) {
    res.status(401);
    throw new Error("Account deactivated. Contact support.");
  }

  // Check password
  if (!(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check role and generate token
  if (user.isModerator || user.isSubModerator) {
    generateToken(res, user._id);

    // Respond with user data
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isModerator: user.isModerator,
      isSubModerator: user.isSubModerator,
      infra_type: user.infra_type
        ? { _id: user.infra_type._id, infra_name: user.infra_type.infra_name }
        : null,
      assignedModerator: user.assignedModerator,
    });
  } else {
    res.status(403);
    throw new Error("Access denied: Not a moderator or submoderator");
  }
});



// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    isAdmin = false,
    isModerator = true,
    infra_type,
    isSubModerator = false,
    assignedModerator,
  } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res
      .status(400)
      .json({ message: "That email has already been used. Try again." });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
    isModerator,
    infra_type,
    isSubModerator,
    assignedModerator,
    createdAt: new Date(),
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isModerator: user.isModerator,
      isSubModerator: user.isSubModerator,
      infra_type: user.infra_type,
      createdAt: user.createdAt,
      assignedModerator: user.assignedModerator,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});



// @desc    Create a new submoderator
// @route   POST /api/users/submoderators
// @access  Private (only moderators or admins should access this)
const createSubModerator = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const assignedModeratorId = req.params.moderatorId;

  // Find the selected moderator by `assignedModeratorId`
  const moderator = await User.findById(assignedModeratorId);

  if (!moderator || !moderator.isModerator) {
    return res
      .status(403)
      .json({ message: "Access denied: Selected user is not a moderator" });
  }

  const infra_type = moderator.infra_type;

  // Check if the email is already in use
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "That email has already been used. Try again." });
  }

  // Create the submoderator and assign them to the selected moderator
  const submoderator = await User.create({
    name,
    email,
    password,
    infra_type,
    isSubModerator: true,
    assignedModerator: assignedModeratorId,
    subModerators: [],
  });

  if (submoderator) {
    // Add the submoderator to the selected moderator's subModerators list
    await User.findByIdAndUpdate(assignedModeratorId, {
      $addToSet: { subModerators: submoderator._id },
    });

    // Populate the assignedModerator details
    const populatedModerator = await User.findById(assignedModeratorId).select('_id name');

    res.status(201).json({
      _id: submoderator._id,
      name: submoderator.name,
      email: submoderator.email,
      isSubModerator: submoderator.isSubModerator,
      infra_type: submoderator.infra_type,
      assignedModerator: {
        _id: populatedModerator._id, // Populate the moderator's _id
        name: populatedModerator.name, // Populate the moderator's name
      },
    });
  } else {
    res.status(400).json({ message: "Invalid submoderator data" });
  }
});


// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin or Moderator
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and delete it
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    res.json({ message: "User removed successfully" });
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);

    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid user ID format." });
    } else {
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
});


// @desc Deactivate a moderator and their submoderators
// @route PUT /api/moderators/:moderatorId/deactivate
// @access Private (requires admin or moderator privileges)
const deactivateModerator = asyncHandler(async (req, res) => {
  const { moderatorId } = req.params;

  try {
    const moderator = await User.findById(moderatorId);

    if (!moderator) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (moderator.isSubModerator) {
      return res.status(400).json({ message: "Cannot deactivate a submoderator directly." });
    }

    if (!moderator.isModerator) {
      return res.status(400).json({ message: "User is not a moderator" });
    }

    if (moderator.deactivated) {
      return res.status(400).json({ message: "Moderator is already deactivated" });
    }

    // Deactivate the moderator and their submoderators
    await User.findByIdAndUpdate(moderatorId, { deactivated: true });
    const { modifiedCount } = await User.updateMany(
      { assignedModerator: moderatorId, isSubModerator: true },
      { deactivated: true }
    );

    const message = modifiedCount > 0
      ? "Moderator and submoderators deactivated successfully"
      : "Moderator deactivated successfully. No submoderators found.";

    return res.status(200).json({ message });
  } catch (error) {
    console.error(`Error deactivating moderator: ${error.message}`);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// @desc Reactivate a moderator and their submoderators
// @route PUT /api/moderators/:moderatorId/reactivate
// @access Private (requires admin or moderator privileges)
const reactivateModerator = asyncHandler(async (req, res) => {
  const { moderatorId } = req.params;

  try {
    const moderator = await User.findById(moderatorId);

    if (!moderator) {
      return res.status(404).json({ message: "User not found" });
    }

    if (moderator.isSubModerator) {
      return res.status(400).json({ message: "Cannot reactivate a submoderator directly." });
    }

    if (!moderator.isModerator) {
      return res.status(400).json({ message: "User is not a moderator" });
    }

    if (!moderator.deactivated) {
      return res.status(400).json({ message: "Moderator is not deactivated" });
    }

    // Reactivate the moderator and their submoderators
    await User.findByIdAndUpdate(moderatorId, { deactivated: false });
    const { modifiedCount } = await User.updateMany(
      { assignedModerator: moderatorId, isSubModerator: true },
      { deactivated: false }
    );

    const message = modifiedCount > 0
      ? "Moderator and submoderators reactivated successfully"
      : "Moderator reactivated successfully. No submoderators found.";

    return res.status(200).json({ message });
  } catch (error) {
    console.error(`Error reactivating moderator: ${error.message}`);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});



// @desc Get all deactivated moderators and submoderators
// @route GET /api/users/deactivated
// @access Private (requires admin or moderator privileges)
const getDeactivatedUsers = asyncHandler(async (req, res) => {
  try {
    // Fetch users where `deactivated` is true and either `isModerator` or `isSubModerator` is true
    const deactivatedUsers = await User.find({
      $or: [
        { isModerator: true, deactivated: true },
        { isSubModerator: true, deactivated: true }
      ]
    }).populate("infra_type", "infra_name");

    // Return deactivated users, even if the array is empty
    return res.status(200).json(deactivatedUsers);
  } catch (error) {
    console.error(`Error fetching deactivated users: ${error.message}`);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});


// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("infra_type", "infra_name");

  if (user) {
    return res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Destructure the request body
    const { name, email, isAdmin, isModerator, isSubModerator, password } = req.body;

    // Update user properties only if they exist in the request body
    if (name) user.name = name;
    if (email) user.email = email;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;
    if (isModerator !== undefined) user.isModerator = isModerator;
    if (isSubModerator !== undefined) user.isSubModerator = isSubModerator;
    if (password) user.password = password;

    const updatedUser = await user.save();

    // Respond with success message and updated user information
    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isModerator: updatedUser.isModerator,
        isSubModerator: updatedUser.isSubModerator,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Find the user by email and check if OTP matches and is not expired
  const user = await User.findOne({
    email,
    resetPasswordToken: otp,
    resetPasswordExpires: { $gt: Date.now() }, // Check if OTP is still valid
  });

  if (user) {
    res.status(200).json({ message: "OTP is valid" });
  } else {
    res.status(400).json({ message: "Invalid or expired OTP" });
  }
});

// @desc    Request password reset
// @route   POST /api/users/password-reset/request
// @access  Public
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const otp = generateOtp();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();
    await sendOtpEmail(user, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Reset password
// @route   POST /api/users/password-reset
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({
    email,
    resetPasswordToken: otp,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (user) {
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Password has been reset successfully" });
  } else {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }
});

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "An error occurred while changing the password" });
  }
});


// @desc    Get moderators and submoderators by infrastructure type
// @route   GET /api/moderators
// @access  Public or Private based on your requirement
const getModerators = asyncHandler(async (req, res) => {
  try {
    const moderators = await User.find({
      $or: [
        { isModerator: true, deactivated: false },
        { isSubModerator: true, deactivated: false }
      ],
    })
    .populate("infra_type", "infra_name")
    .populate("assignedModerator", "name"); 

    res.status(200).json(moderators.length ? moderators : []);
  } catch (error) {
    console.error("Error fetching moderators:", error); 
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Get moderators by infrastructure type
// @route   GET /api/moderators
// @access  Public or Private based on your requirement
const getModeratorList = asyncHandler(async (req, res) => {
  try {
    const moderators = await User.find({ isModerator: true, deactivated: false })
      .populate("infra_type", "infra_name")
      .populate("assignedModerator", "name");

    res.status(200).json(moderators.length ? moderators : []);
  } catch (error) {
    console.error("Error fetching moderators:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// @desc    Get submoderators by infrastructure type
// @route   GET /api/submoderators
// @access  Public or Private based on your requirement
const getSubModeratorList = asyncHandler(async (req, res) => {
  try {
    const subModerators = await User.find({ isSubModerator: true, deactivated: false })
      .populate("infra_type", "infra_name") 
      .populate("assignedModerator", "name"); 

    res.status(200).json(subModerators.length ? subModerators : []);
  } catch (error) {
    console.error("Error fetching submoderators:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// @desc    Check if email exists
// @route   GET /api/users/check-email/:email
// @access  Public
const checkEmailExists = asyncHandler(async (req, res) => {
  const { email } = req.params;

  console.log(`Received request to check email: ${email}`); // Logging

  try {
    // Check if the email exists in the User collection
    const user = await User.findOne({ email });

    if (user) {
      console.log("Email exists in users");
      return res.json({ exists: true });
    }

    // Check if the email exists in any submoderators
    const subModerator = await User.findOne({ "subModerators.email": email });

    if (subModerator) {
      console.log("Email exists in submoderators");
      return res.json({ exists: true });
    }

    console.log("Email does not exist");
    res.json({ exists: false });
  } catch (error) {
    console.error("Error in checkEmailExists:", error); // Logging
    res.status(500).json({ message: "Server error" });
  }
});

export {
  authUser,
  adminUser,
  moderatorUser,
  registerUser,
  createSubModerator,
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
  getSubModeratorList,
  getModeratorList,
  checkEmailExists,
};
