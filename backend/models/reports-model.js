import mongoose from "mongoose";
import User from "./user-model.js";
import Status from "./status-model.js";
import InfrastructureType from "./infrastructureType-model.js";

const reportSchema = mongoose.Schema(
  {
    report_mod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      default: null,
      nullable: true,
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
    report_contactNum: {
      type: String,
      required: true,
    },
    report_status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Status,
      default: "66d25911baae7f52f54793f6",
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
    infraType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: InfrastructureType,
      required: true,
    },
    is_archived: {
      type: Boolean,
      default: false,
    },
    archived_at: {
      type: Date,
    },
    report_time_resolved:{
      type: Date,
      default: null,
      nullable: true, 
    }
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;
