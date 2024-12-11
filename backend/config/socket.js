import { Server } from "socket.io";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

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
        const fullDocument = change.fullDocumentBeforeChange;

        if (fullDocument) {
          const message = [
            `InfraSee`,
            `Hello ${fullDocument.report_by}, your report was deleted due to inactivity as no moderator could take action.`,
            `Please resubmit if needed.`,
          ].join("\n");

          sendSMSNotification(io, fullDocument.report_contactNum, message);
        } else {
          console.error("Full document not available for delete operation.");
        }
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
