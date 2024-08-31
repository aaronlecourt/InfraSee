import mongoose from "mongoose";
import Status from "./status.js";
import UserAccounts from "./userAccounts.js";

const reportsSchema = mongoose.Schema(
    {
        report_mod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: UserAccounts,
            required: true,
        },
        report_img: {
            type: String,
        },
        report_desc: {
            type: String,
            required: true,
        },
        report_by: {
            type: String,
            required: true,
        },
        report_status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Status,
            required: true,
        },
        report_address: {
            type: String,
            required: true,
        },
        report_lat: {
            type: Number,
            required: true,
        },
        report_lng: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)
const Reports = mongoose.model('Reports', reportsSchema)

export default Reports