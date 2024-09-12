import mongoose from "mongoose";

const reportSchema = mongoose.Schema(
  {
    report_mod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
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
      ref: "status",
    },
    report_address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
