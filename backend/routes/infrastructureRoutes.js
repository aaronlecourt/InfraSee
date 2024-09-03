import express from 'express';
import { getInfrastructureTypes, createInfrastructureType, deleteInfrastructureType } from '../controllers/infrastructureController.js';
import { protect, admin} from "../middleware/auth-middleware.js";

const router = express.Router();

router.route('/')
  .get(getInfrastructureTypes)
  .post(protect, admin, createInfrastructureType);

router.route('/:id')
  .delete(protect, admin, deleteInfrastructureType);

export default router;
