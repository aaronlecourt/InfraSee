import mongoose from "mongoose";
import User from "./user-model.js";
import Status from "./status-model.js";

const reportSchema = mongoose.Schema(
  {
    report_mod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    report_img: {
      type: String,
      required: true,
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
    },
    report_address: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    is_archived: { 
      type: Boolean, 
      default: false 
    },
    archived_at: { 
      type: Date 
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;
