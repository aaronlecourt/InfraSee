import { Server } from 'socket.io';
import mongoose from 'mongoose';

const sendSMS = async (socket, data) => {
  const { message, phone_number } = data;

  try {
    console.log('Attempting to send SMS:', { message, phone_number });
    socket.broadcast.emit('sms sender', { message, phone_number });
    console.log('SMS sent successfully:', { message, phone_number });
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
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

    socket.on('sms sender', (data) => {
      console.log('Received SMS sender request from client:', socket.id);
      sendSMS(socket, data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};


export const setupChangeStream = (collectionName, eventName, io) => {
  const changeStream = mongoose.connection.collection(collectionName).watch();

  changeStream.on('change', (change) => {
    console.log(`Change detected in ${collectionName}:`, change);
    io.emit(eventName, change);
  });

  changeStream.on('error', (error) => {
    console.error(`Change stream error on ${collectionName}:`, error);
  });
};

export { createSocketServer };