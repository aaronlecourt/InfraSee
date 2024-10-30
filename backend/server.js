import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/error-middleware.js';
import userRoutes from './routes/user-routes.js';
import infrastructureRoutes from './routes/infrastructure-routes.js';
import reportRoutes from './routes/reports-routes.js'
import statusRoutes from './routes/status-routes.js'
import notificationRoutes from './routes/notifications-routes.js'
import mongoose from 'mongoose';
import { createSocketServer, setupChangeStream } from './config/socket.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();
const server = http.createServer(app);
const io = createSocketServer(server);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// API routes
app.use('/api/users', userRoutes);
app.use('/api/infrastructure-types', infrastructureRoutes);
app.use('/api/reports', reportRoutes)
app.use('/api/status', statusRoutes)
app.use('/api/notification', notificationRoutes)


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

mongoose.connection.once('open', () => {
  setupChangeStream('reports', 'reportChange', io);
  setupChangeStream('users', 'userChange', io);
  setupChangeStream('infrastructure-types', 'infrastructureChange', io);
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});