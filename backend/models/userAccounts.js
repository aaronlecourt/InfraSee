import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import InfrastructureTypes from "./infrastructureTypes.js";
import SecurityQuestions from "./securityQuestions.js";

const userAccountsSchema = mongoose.Schema(
    {
        isAdmin: {
            type: Boolean,
            default: false,
        },
        user_name: {
            type: String,
            required: true,
        },
        email_add: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        infra_type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: InfrastructureTypes,
            required: true
        },
        slct_qst: {
            type: mongoose.Schema.Types.ObjectId,
            ref: SecurityQuestions,
        },
        qst_answer: {
            type: String,
            required: true,
        },
        email_toggled: {
            type: Boolean,
            default: true,
        },
        image_toggled: {
            type: Boolean,
            default: true,
        },
        accnum_toggled: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

userAccountsSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userAccountsSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const UserAccounts = mongoose.model("UserAccounts", userAccountsSchema);

export default UserAccounts