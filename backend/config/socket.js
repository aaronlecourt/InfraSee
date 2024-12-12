import { Server } from "socket.io";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Status from "../models/status-model.js";

const sendSMSNotification = (io, phoneNumber, message) => {
  io.emit("sms sender", { phone_number: phoneNumber, message });
  console.log("SMS sender event emitted to socket:", {
    message,
    phone_number: phoneNumber,
  });
};

const createSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

export const setupChangeStream = (collectionName, eventName, io) => {
  const changeStream = mongoose.connection
    .collection(collectionName)
    .watch([], {
      fullDocumentBeforeChange: "required",
    });

  changeStream.on(
    "change",
    asyncHandler(async (change) => {
      console.log(`Change detected in ${collectionName}:`, change);

      if (change.operationType === "delete" && collectionName === "reports") {
        const { fullDocumentBeforeChange } = change;

        if (!fullDocumentBeforeChange) {
          console.error(
            "No fullDocumentBeforeChange available for delete operation"
          );
          return;
        }

        const unassignedStatus = await Status.findOne({
          stat_name: "Unassigned",
        });

        if (!unassignedStatus) {
          console.error('Unable to find "Unassigned" status');
          return;
        }

        if (
          fullDocumentBeforeChange &&
          String(fullDocumentBeforeChange.report_status) ===
            String(unassignedStatus._id)
        ) {
          const message = [
            `InfraSee`,
            `Hello ${fullDocumentBeforeChange.report_by}, your report was deleted as it was marked "Unassigned" and no moderator could take action.`,
            `Please resubmit if needed.`,
          ].join("\n");

          sendSMSNotification(
            io,
            fullDocumentBeforeChange.report_contactNum,
            message
          );
        }
        io.emit("reportChange", {
          operationType: change.operationType,
          documentKey: change.documentKey,
          fullDocumentBeforeChange: change.fullDocumentBeforeChange,
        });
      } // Handling the "update" operation for "users"
      else if (
        change.operationType === "update" &&
        collectionName === "users"
      ) {
        const { updateDescription, fullDocumentBeforeChange } = change;

        // Check if the `deactivated` field was updated to `true`
        if (updateDescription.updatedFields.deactivated === true) {
          const userId = fullDocumentBeforeChange._id.toString();

          // Emit a specific event notifying about the deactivation
          io.emit("userDeactivated", {
            userId,
            message: "This user has been deactivated.",
            timestamp: new Date().toISOString(),
          });

          // Optionally, log this information
          console.log(`User ${userId} has been deactivated.`);
        }

        // Emit a general user change event (optional)
        io.emit("userChange", {
          operationType: change.operationType,
          documentKey: change.documentKey,
          fullDocumentBeforeChange: change.fullDocumentBeforeChange,
          updateDescription: change.updateDescription,
        });
      } else {
        io.emit(eventName, change);
      }
    })
  );

  changeStream.on("error", (error) => {
    console.error(`Change stream error on ${collectionName}:`, error);
  });
};

export { createSocketServer, sendSMSNotification };
