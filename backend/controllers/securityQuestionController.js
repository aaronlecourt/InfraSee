import asyncHandler from 'express-async-handler';
import SecurityQuestion from '../models/securityQuestion-model.js';

// @desc    Get all security questions
// @route   GET /api/security-questions
// @access  Public
const getSecurityQuestions = asyncHandler(async (req, res) => {
  const questions = await SecurityQuestion.find();
  res.json(questions);
});

// @desc    Create a new security question
// @route   POST /api/security-questions
// @access  Private/Admin
const createSecurityQuestion = asyncHandler(async (req, res) => {
  const { qst_name } = req.body;

  const questionExists = await SecurityQuestion.findOne({ qst_name });

  if (questionExists) {
    res.status(400);
    throw new Error('Security question already exists');
  }

  const question = await SecurityQuestion.create({ qst_name });
  res.status(201).json(question);
});

// @desc    Delete a security question
// @route   DELETE /api/security-questions/:id
// @access  Private/Admin
const deleteSecurityQuestion = asyncHandler(async (req, res) => {
  const question = await SecurityQuestion.findById(req.params.id);

  if (!question) {
    res.status(404);
    throw new Error('Security question not found');
  }

  await question.remove();
  res.json({ message: 'Security question removed' });
});

export { getSecurityQuestions, createSecurityQuestion, deleteSecurityQuestion };
