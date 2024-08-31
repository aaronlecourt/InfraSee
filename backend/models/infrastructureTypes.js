import mongoose from "mongoose";

const infrastructureTypesSchema = mongoose.Schema(
    {
        infra_name: {
            type: String,
            required: true
        }
    }
)

const InfrastructureTypes = mongoose.model('InfrastructureTypes', infrastructureTypesSchema);
export default InfrastructureTypes