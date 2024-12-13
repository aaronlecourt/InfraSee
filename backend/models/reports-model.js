import mongoose from "mongoose";
import User from "./user-model.js";
import Status from "./status-model.js";
import InfrastructureType from "./infrastructureType-model.js";
import EXPIRATION_TIME from "../../frontend/src/lib/constant.js";

const reportSchema = mongoose.Schema(
  {
    is_new: {
      type: Boolean,
      default: true,
    },
    submod_is_new: {
      type: Boolean,
      default: true,
    },
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
    status_remark: {
      type: String,
      default: null,
      nullable: true,
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
    is_hidden: {
      type: Boolean,
      default: false,
    },
    hidden_at: {
      type: Date,
    },
    is_approved: {
      type: Boolean,
      default: false,
    },
    is_requested: {
      type: Boolean,
      default: false,
    },
    report_time_resolved: {
      type: Date,
      default: null,
      nullable: true,
    },
    request_time: {
      type: Date,
      default: null,
      nullable: true,
    },
    unassignedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ unassignedAt: 1 }, { expireAfterSeconds: EXPIRATION_TIME});

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

async function ensureIndexes() {
  if (!mongoose.connection.readyState) {
    console.error("Database connection is not ready.");
    return;
  }

  const collection = mongoose.connection.db.collection("reports");

  try {
    // Get existing indexes
    const existingIndexes = await collection.indexes();
    
    // Find index by name
    const unassignedAtIndex = existingIndexes.find(index => index.name === "unassignedAt_1");

    // If the index exists with different options, drop it
    if (unassignedAtIndex && unassignedAtIndex.expireAfterSeconds !== EXPIRATION_TIME) {
      console.log("Dropping conflicting index...");
      await collection.dropIndex("unassignedAt_1");
    }

    // Sync the indexes after handling conflicts
    await Report.syncIndexes();
    console.log("Indexes synced successfully.");
  } catch (error) {
    console.error("Error syncing indexes:", error);
  }
}

// Ensure the connection is established before syncing indexes
mongoose.connection.once('open', async () => {
  await ensureIndexes();
  console.log("Database connection established.");
});


export default Report;

