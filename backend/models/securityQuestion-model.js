import mongoose from 'mongoose';

const securityQuestionSchema = mongoose.Schema({
  qst_name: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const SecurityQuestion = mongoose.models.SecurityQuestion || mongoose.model('SecurityQuestion', securityQuestionSchema);

export default SecurityQuestion;
