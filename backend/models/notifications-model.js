import mongoose from "mongoose";
import User from "./user-model.js";
import Report from "./reports-model.js";

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Report,
      required: false, 
    },
    message: {
      type: String,
      required: true,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    notification_type: {
      type: String,
      enum: ["reportStatusChange", "newReport", "accountUpdate", "reportApproval", "reportRejection"], 
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
