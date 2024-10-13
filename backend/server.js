import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/error-middleware.js';
import userRoutes from './routes/user-routes.js';
import infrastructureRoutes from './routes/infrastructure-routes.js';
import reportRoutes from './routes/reports-routes.js';
import statusRoutes from './routes/status-routes.js';
import mongoose from 'mongoose'; // Import mongoose

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/infrastructure-types', infrastructureRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/status', statusRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('Server is ready...');
  });
}

app.use(notFound);
app.use(errorHandler);

// Listen for socket connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Function to set up a change stream listener for a collection
const setupChangeStream = (collectionName, eventName) => {
  const collection = db.collection(collectionName);
  const changeStream = collection.watch();

  changeStream.on('change', (change) => {
    console.log(`Change detected in ${collectionName}:`, change);

    // Emit the change event to all connected clients with the specified event name
    io.emit(eventName, change);
  });
};

// MongoDB change stream listeners for multiple collections
const db = mongoose.connection;

db.once('open', () => {
  console.log('MongoDB connected');

  // Setup change streams for multiple collections
  setupChangeStream('reports', 'reportChange');
  setupChangeStream('users', 'userChange');
  setupChangeStream('infrastructure-types', 'infrastructureChange');
});

// Start the server with Socket.IO
server.listen(port, () =>
  console.log(`Server started on port ${port}`)
);
