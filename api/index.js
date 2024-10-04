import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../backend/config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from '../backend/middleware/error-middleware.js';
import userRoutes from '../backend/routes/user-routes.js';
import infrastructureRoutes from '../backend/routes/infrastructure-routes.js';
import reportRoutes from '../backend/routes/reports-routes.js'
import statusRoutes from '../backend/routes/status-routes.js'

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


// API routes
app.use('/api/users', userRoutes);

app.use('/api/infrastructure-types', infrastructureRoutes);
app.use('/api/reports', reportRoutes)
app.use('/api/status', statusRoutes)

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

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);
