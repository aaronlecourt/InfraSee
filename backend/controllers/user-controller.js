import asyncHandler from "express-async-handler";
import User from "../models/user-model.js";
import Report from "../models/reports-model.js";
import Status from "../models/status-model.js";
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
  const user = await User.findOne({ email }).populate(
    "infra_type",
    "_id infra_name"
  );

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

    // Respond with user data, including the `can_create` field
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      can_create: user.can_create,
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

  // Check if the email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "That email has already been used. Try again." });
    return;
  }

  // Create the new user
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
    if (user.isModerator) {
      const currentUser = await User.findById(user._id).populate('moderators');

      user.can_create = currentUser.moderators.length === 0 ? true : false;
      await user.save();
    }

    // Generate the token
    generateToken(res, user._id);

    // Send the response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      can_create: user.can_create,
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


// @desc    Create a new moderator
// @route   POST /api/users/moderators
// @access  Private (only moderators with can_create privilege)
const createModerator = asyncHandler(async (req, res) => {
  const { name, email, password, infra_type } = req.body;

  // Check if the requesting user is a moderator with can_create privilege
  if (!(req.user && req.user.isModerator && req.user.can_create)) {
    return res.status(403).json({
      message: "Access denied: Only moderators with the 'can_create' privilege can create moderators.",
    });
  }

  // Check if the email is already in use
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "That email has already been used. Try again." });
  }

  // Create the new moderator
  const moderator = await User.create({
    name,
    email,
    password,
    infra_type,
    isModerator: true,
    can_create: false, 
    moderators: [], 
    subModerators: [], 
  });

  if (moderator) {
    // Add the newly created moderator to the moderators array of the current user
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { moderators: moderator._id },
    });

    // Update the assignedModerator field for the new moderator to the user who created them
    await User.findByIdAndUpdate(moderator._id, {
      assignedModerator: req.user._id,
    });

    res.status(201).json({
      _id: moderator._id,
      name: moderator.name,
      email: moderator.email,
      infra_type: moderator.infra_type,
      isModerator: moderator.isModerator,
      can_create: moderator.can_create,
      assignedModerator: {
        _id: req.user._id,
        name: req.user.name,
      },
    });
  } else {
    res.status(400).json({ message: "Invalid moderator data" });
  }
});


// @desc    Create a new submoderator
// @route   POST /api/users/submoderators
// @access  Private (only moderators with `can_create` privilege)
const createSubModerator = asyncHandler(async (req, res) => {
  const { name, email, password, infra_type } = req.body;

  // Check if the requesting user is a moderator with `can_create` privilege
  if (!(req.user && req.user.isModerator && req.user.can_create)) {
    return res.status(403).json({
      message:
        "Access denied: Only moderators with 'create' privileges are allowed to add sub-moderators.",
    });
  }

  // Check if the email is already in use
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "That email has already been used. Try again." });
  }

  // Create the new submoderator
  const submoderator = await User.create({
    name,
    email,
    password,
    infra_type,
    isSubModerator: true,
    subModerators: [],
  });

  if (submoderator) {
    // Add the newly created submoderator to the `subModerators` array of the selected moderator
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { subModerators: submoderator._id },
    });

    // Update the `assignedModerator` field for the new submoderator to the user who created them (req.user)
    await User.findByIdAndUpdate(submoderator._id, {
      assignedModerator: req.user._id,
    });

    // Populate the current user's details (assigned moderator)
    const populatedModerator = await User.findById(req.user._id).select("_id name");

    res.status(201).json({
      _id: submoderator._id,
      name: submoderator.name,
      email: submoderator.email,
      infra_type: submoderator.infra_type,
      isSubModerator: submoderator.isSubModerator,
      assignedModerator: {
        _id: populatedModerator._id,  
        name: populatedModerator.name, 
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
    const moderatorId = req.params.id;

    // Find the user by ID and delete it
    const user = await User.findByIdAndDelete(moderatorId);

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

const deactivateModerator = asyncHandler(async (req, res) => {
  const { moderatorId } = req.params;

  try {
    const user = await User.findById(moderatorId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve status IDs for "Under Review", "For Revision", "In Progress", and "Pending"
    const statuses = await Status.find({
      stat_name: {
        $in: ["Under Review", "For Revision", "In Progress", "Pending"],
      },
    });
    const statusIds = statuses.map((status) => status._id);

    if (user.isModerator) {
      // Check if there are any reports with "Under Review", "For Revision", "In Progress", or "Pending" assigned to this moderator
      const pendingReports = await Report.find({
        report_mod: moderatorId,
        report_status: { $in: statusIds },
      });

      if (pendingReports.length > 0) {
        return res.status(400).json({
          message: "Cannot deactivate moderator with pending reports.",
        });
      }

      // Deactivate the moderator and their submoderators
      await User.findByIdAndUpdate(moderatorId, { deactivated: true });
      const { modifiedCount } = await User.updateMany(
        { assignedModerator: moderatorId, isSubModerator: true },
        { deactivated: true }
      );

      const message =
        modifiedCount > 0
          ? "Moderator and submoderators deactivated successfully"
          : "Moderator deactivated successfully. No submoderators found.";

      return res.status(200).json({ message });
    } else if (user.isSubModerator) {
      // Check if the assigned moderator has any reports with "Under Review" or "For Revision" status
      const underReviewStatus = statuses.find(
        (status) => status.stat_name === "Under Review"
      )?._id;
      const forRevisionStatus = statuses.find(
        (status) => status.stat_name === "For Revision"
      )?._id;

      const pendingReports = await Report.find({
        report_mod: user.assignedModerator,
        $or: [
          { report_status: underReviewStatus },
          { report_status: forRevisionStatus },
        ],
      });

      if (pendingReports.length > 0) {
        return res.status(400).json({
          message:
            "Cannot deactivate the submoderator due to pending reports under review or for revision.",
        });
      }

      // Proceed with deactivation of submoderator
      await User.findByIdAndUpdate(moderatorId, { deactivated: true });
      return res
        .status(200)
        .json({ message: "Submoderator deactivated successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "User is neither a moderator nor a submoderator." });
    }
  } catch (error) {
    console.error(`Error deactivating user: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

// @desc Reactivate a moderator, their submoderators, or a single submoderator
// @route PUT /api/moderators/:moderatorId/reactivate
// @access Private (requires admin or moderator privileges)
const reactivateModerator = asyncHandler(async (req, res) => {
  const { moderatorId } = req.params;

  try {
    const user = await User.findById(moderatorId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already active
    if (!user.deactivated) {
      return res.status(400).json({ message: "User is not deactivated" });
    }

    // Reactivate moderator and all associated submoderators if applicable
    if (user.isModerator && !user.isSubModerator) {
      await User.findByIdAndUpdate(moderatorId, { deactivated: false });
      const { modifiedCount } = await User.updateMany(
        { assignedModerator: moderatorId, isSubModerator: true },
        { deactivated: false }
      );

      const message =
        modifiedCount > 0
          ? "Moderator and submoderators reactivated successfully"
          : "Moderator reactivated successfully. No submoderators found.";

      return res.status(200).json({ message });
    }

    // Reactivate a single submoderator
    if (user.isSubModerator) {
      await User.findByIdAndUpdate(moderatorId, { deactivated: false });
      return res
        .status(200)
        .json({ message: "Submoderator reactivated successfully" });
    }

    return res
      .status(400)
      .json({ message: "User is neither a moderator nor a submoderator" });
  } catch (error) {
    console.error(`Error reactivating user: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

// @desc Get all deactivated moderators and submoderators
// @route GET /api/users/deactivated
// @access Private (requires admin or moderator privileges)
const getDeactivatedUsers = asyncHandler(async (req, res) => {
  try {
    // Fetch users where `deactivated` is true and either `isModerator` or `isSubModerator` is true
    const deactivatedUsers = await User.find({
      isModerator: true,
      can_create: true,
      deactivated: true,
    }).populate("infra_type", "infra_name");

    // Return deactivated users, even if the array is empty
    return res.status(200).json(deactivatedUsers);
  } catch (error) {
    console.error(`Error fetching deactivated users: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

// @desc    Get Deactivated Secondary Mods and Sub Mods for Current Moderator
// @route   GET /api/deactivated-mods
// @access  Private
const getDeactivatedMods = asyncHandler(async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find the logged-in user and populate necessary fields
    const loggedInUser = await User.findById(loggedInUserId)
      .populate({
        path: 'moderators', 
        select: '', 
      })
      .populate({
        path: 'subModerators',
        select: '',
      })
      .populate('infra_type', 'infra_name');

    if (!loggedInUser || !loggedInUser.isModerator) {
      return res.status(404).json({ message: 'User not found or not a moderator' });
    }

    // Get both secondary moderators and sub-moderators
    const allModerators = [
      ...loggedInUser.moderators, 
      ...loggedInUser.subModerators
    ];

    // Filter for deactivated moderators (both secondary and sub)
    const deactivatedModerators = allModerators.filter(mod => mod.deactivated === true);

    if (deactivatedModerators.length === 0) {
      return res.status(200).json({ message: 'No deactivated moderators found' });
    }

    // Return the list of deactivated moderators
    res.status(200).json(deactivatedModerators);
  } catch (error) {
    console.error("Error fetching deactivated moderators:", error);
    res.status(500).json({ message: "Server error" });
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
  const user = await User.findById(req.user._id).populate(
    "infra_type",
    "infra_name"
  );

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
    const { name, email, isAdmin, isModerator, isSubModerator, password } =
      req.body;

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
    return res
      .status(500)
      .json({ message: "An error occurred while changing the password" });
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
        { isSubModerator: true, deactivated: false },
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

// @desc    Get Main Mods
// @route   GET /api/moderators-list
// @access  Public or Private based on your requirement
const getModeratorList = asyncHandler(async (req, res) => {
  try {
    const moderators = await User.find({
      isModerator: true,
      can_create: true,
      deactivated: false,
    })
      .populate("infra_type", "infra_name")
      .populate("assignedModerator", "name");

    res.status(200).json(moderators.length ? moderators : []);
  } catch (error) {
    console.error("Error fetching moderators:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// @desc    Get Secondary Mods for Current Moderator
// @route   GET /api/secondary-mods
// @access  Private
const getSecondaryMods = asyncHandler(async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const loggedInUser = await User.findById(loggedInUserId)
      .populate({
        path: 'moderators', 
        select: '', 
      })
      .populate('infra_type', 'infra_name');
    if (!loggedInUser || !loggedInUser.isModerator) {
      return res.status(404).json({ message: 'User not found or not a moderator' });
    }

    const secondaryModerators = loggedInUser.moderators;

    const activeModerators = secondaryModerators.filter(mod => mod.deactivated === false);

    
    if (activeModerators.length === 0) {
      return res.status(200).json({ message: 'No active secondary moderators found' });
    }

    res.status(200).json(activeModerators);
  } catch (error) {
    console.error("Error fetching secondary moderators:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// @desc    Get submoderators by infrastructure type
// @route   GET /api/submoderators
// @access  Public or Private based on your requirement
const getSubModeratorList = asyncHandler(async (req, res) => {
  try {
    // Assuming the logged-in user's ID is available in req.user._id
    const loggedInUserId = req.user._id;

    // Find submoderators associated with the logged-in user
    const subModerators = await User.find({
      isSubModerator: true,
      deactivated: false,
      assignedModerator: loggedInUserId, // Filter by the logged-in user's assignedModerator
    })
      .populate("infra_type", "infra_name")
      .populate("assignedModerator", "name");

    // Return the submoderators or an empty array if none are found
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
  createModerator,
  createSubModerator,
  deleteUser,
  deactivateModerator,
  reactivateModerator,
  getDeactivatedUsers,
  getDeactivatedMods,
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
  getSecondaryMods
};
