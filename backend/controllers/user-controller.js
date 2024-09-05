import asyncHandler from "express-async-handler";
import User from "../models/user-model.js";
import SecurityQuestion from "../models/securityQuestion-model.js";
import generateToken from "../utils/generate-token.js";

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

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Check if user is a moderator
    if (!user.isModerator) {
      res.status(403);
      throw new Error("Access denied: Not a moderator");
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
    return; // Ensure you return after sending a response
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
    isModerator,
    infra_type,
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
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
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

// @desc    Get moderators by infrastructure type
// @route   GET /api/moderators
// @access  Public or Private based on your requirement
const getModerators = asyncHandler(async (req, res) => {
  const { infra_type } = req.query; // Extract infrastructure type from query parameters

  // Fetch moderators based on the infrastructure type ObjectId
  const moderators = await User.find({
    isModerator: true,
    infrastructureType: infra_type,
  });

  res.json(moderators);
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


// @desc    Get selected security question for email
// @route   GET /api/users/security-question/:email
// @access  Public
const getSecurityQuestionByEmail = asyncHandler(async (req, res) => {
  const { email, slct_quest } = req.params;

  // Find the user by email
  const user = await User.findOne({ email });

  if (user && user.slct_quest) {
    // Find the security question by its ID
    const securityQuestion = await SecurityQuestion.findById(user.slct_quest);

    if (securityQuestion) {
      res.json({ question: securityQuestion.qst_name });
    } else {
      res.status(404).json({ message: "Security question not found." });
    }
  } else {
    res.status(404).json({ message: "No security question set for this email." });
  }
});

export {
  authUser,
  adminUser,
  moderatorUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getModerators,
  checkEmailExists,
  getSecurityQuestionByEmail,
};
