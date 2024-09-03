import mongoose from 'mongoose';

// Define the schema for the InfrastructureType
const infrastructureTypeSchema = mongoose.Schema({
  infra_name: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Check if the model already exists
const InfrastructureType = mongoose.models.InfrastructureType || mongoose.model('InfrastructureType', infrastructureTypeSchema);

export default InfrastructureType;
