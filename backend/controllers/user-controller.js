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
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const moderatorUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('infra_type', 'infra_name');

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if the account is deactivated
  if (user.isDeactivated) {
    res.status(403);
    throw new Error("Account is deactivated");
  }

  // Check if the password matches
  if (user && (await user.matchPassword(password))) {
    if (!user.isModerator) {
      res.status(403);
      throw new Error("Access denied: Not a moderator");
    }

    // Generate token for authenticated user
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isModerator: user.isModerator,
      infra_type: user.infra_type ? { _id: user.infra_type._id, infra_name: user.infra_type.infra_name } : null,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
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
    isModerator,
    infra_type,
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
    isDeactivated: false,
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
      infra_type: user.infra_type,
      createdAt: user.createdAt,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
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

    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid user ID format.' });
    } else {
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
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
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isModerator: user.isModerator,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;
    user.isModerator = req.body.isModerator || isModerator;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isModerator: updatedUser.isModerator,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
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
    res.status(200).json({ message: 'OTP is valid' });
  } else {
    res.status(400).json({ message: 'Invalid or expired OTP' });
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

    res.status(200).json({ message: 'OTP sent to your email' });
  } else {
    res.status(404);
    throw new Error('User not found');
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
    res.status(200).json({ message: 'Password has been reset successfully' });
  } else {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }
});


// @desc    Get moderators by infrastructure type
// @route   GET /api/moderators
// @access  Public or Private based on your requirement
const getModerators = asyncHandler(async (req, res) => {
  try {
    const moderators = await User.find({
      isModerator: true
    })
    .populate('infra_type', 'infra_name');
    res.json(moderators);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Check if email exists
// @route   GET /api/users/check-email/:email
// @access  Public
const checkEmailExists = asyncHandler(async (req, res) => {
  const { email } = req.params;

  console.log(`Received request to check email: ${email}`); // Logging

  try {
    const user = await User.findOne({ email });

    if (user) {
      console.log('Email exists');
      res.json({ exists: true });
    } else {
      console.log('Email does not exist');
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error in checkEmailExists:', error); // Logging
    res.status(500).json({ message: "Server error" });
  }
});



export {
  authUser,
  adminUser,
  moderatorUser,
  registerUser,
  deleteUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  verifyOtp,
  requestPasswordReset,
  resetPassword,
  getModerators,
  checkEmailExists,
};
