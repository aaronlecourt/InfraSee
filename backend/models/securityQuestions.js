import mongoose from "mongoose";

const securityQuestionsSchema = mongoose.Schema(
    {
        qst_name: {
            type: String,
            required: true
        }
    }
)

const SecurityQuestions = mongoose.model('SecurityQuestions', securityQuestionsSchema)
export default SecurityQuestions