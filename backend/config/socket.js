import { Server } from 'socket.io';
import mongoose from 'mongoose';

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

  changeStream.on('change', (change) => {
    console.log(`Change detected in ${collectionName}:`, change);
    io.emit(eventName, change);
  });

  changeStream.on('error', (error) => {
    console.error(`Change stream error on ${collectionName}:`, error);
  });
};

export { createSocketServer };
