import asyncHandler from 'express-async-handler';
import InfrastructureType from '../models/infrastructureType-model.js';

// @desc    Get all infrastructure types
// @route   GET /api/infrastructure-types
// @access  Public
const getInfrastructureTypes = asyncHandler(async (req, res) => {
  const types = await InfrastructureType.find();
  res.json(types);
});

// @desc    Create a new infrastructure type
// @route   POST /api/infrastructure-types
// @access  Private/Admin
const createInfrastructureType = asyncHandler(async (req, res) => {
  const { infra_name } = req.body;

  const typeExists = await InfrastructureType.findOne({ infra_name });

  if (typeExists) {
    res.status(400);
    throw new Error('Infrastructure type already exists');
  }

  const type = await InfrastructureType.create({ infra_name });
  res.status(201).json(type);
});

// @desc    Delete an infrastructure type
// @route   DELETE /api/infrastructure-types/:id
// @access  Private/Admin
const deleteInfrastructureType = asyncHandler(async (req, res) => {
  const type = await InfrastructureType.findById(req.params.id);

  if (!type) {
    res.status(404);
    throw new Error('Infrastructure type not found');
  }

  await type.remove();
  res.json({ message: 'Infrastructure type removed' });
});

export { getInfrastructureTypes, createInfrastructureType, deleteInfrastructureType };
