import mongoose from 'mongoose';

const statusSchema = mongoose.Schema({
  stat_name: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const Status = mongoose.models.Status || mongoose.model('Status', statusSchema);

export default Status;
