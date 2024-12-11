import { Server } from 'socket.io';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';


const sendSMSNotification = (io, phoneNumber, message) => {
  io.emit('sms sender', { phone_number: phoneNumber, message });
  console.log('SMS sender event emitted to socket:', { message, phone_number: phoneNumber });
};


const createSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};


export const setupChangeStream = (collectionName, eventName, io) => {
  const changeStream = mongoose.connection.collection(collectionName).watch();

  changeStream.on('change', asyncHandler(async (change) => {
    console.log(`Change detected in ${collectionName}:`, change);

    // Only handle delete events from the 'reports' collection
    if (change.operationType === 'delete' && collectionName === 'reports') {
      const deletedReportId = change.documentKey._id;

      const message = [
        `InfraSee`,
        `Hello, your report with ID ${deletedReportId} has been deleted due to inactivity.`,
        `If this was a mistake, please resubmit the report.`,
      ].join("\n");

      sendSMSNotification(io, change.fullDocument.report_contactNum, message);
    } else {
      // Emit other change events as needed
      io.emit(eventName, change);
    }
  }));

  changeStream.on('error', (error) => {
    console.error(`Change stream error on ${collectionName}:`, error);
  });
};

export { createSocketServer, sendSMSNotification };