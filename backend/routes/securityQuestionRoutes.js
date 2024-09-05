import express from 'express';
import {
  getSecurityQuestions,
  createSecurityQuestion,
  deleteSecurityQuestion
} from '../controllers/securityQuestionController.js';
import { protect, admin } from "../middleware/auth-middleware.js";

const router = express.Router();

// Route to get all security questions
router.route('/')
  .get(getSecurityQuestions)
  .post(protect, admin, createSecurityQuestion);

// Route to delete a security question by ID
router.route('/:id')
  .delete(protect, admin, deleteSecurityQuestion);

export default router;
