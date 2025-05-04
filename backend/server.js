import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandlerMiddleware } from './middlewares/index.js';

/* Load environment variables */
dotenv.config();

/* ENV VARIABLES */
const {
  APP_PORT = 5000,
  MONGO_DB_URI,
  CLIENT_URL = 'http://localhost:5173',
  RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000, // Default 15 minutes
  RATE_LIMIT_MAX_REQUESTS = 100, // Default 100 requests
} = process.env;

/* IMPORT ALL ROUTES */
import {
  almirahRouter,
  authRouter,
  batchRouter,
  bookRouter,
  categoryRouter,
  clearanceRouter,
  departementRouter,
  eBookRouter,
  genralRouter,
  studentRouter,
  teacherRouter,
  transactionRouter,
} from './routes/index.js';

/* CONFIGURATION */
const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* CORS CONFIGURATION */
const corsOptions = {
  credentials: true,
  origin: [CLIENT_URL],
};
app.use(cors(corsOptions));

/* SECURITY HEADERS */
app.use(helmet());

/* RATE LIMITING TO PREVENT ABUSE */
const limiter = rateLimit({
  windowMs: parseInt(RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(RATE_LIMIT_MAX_REQUESTS, 10),
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

/* ABSOLUTE PATH OF BACKEND FOLDER */
const __filename = fileURLToPath(import.meta.url);
export const ROOT_PATH = path.dirname(__filename);

/* STATIC FOLDER */
app.use('/public', express.static(path.join(ROOT_PATH, 'public')));
app.use('/uploads', express.static(path.join(ROOT_PATH, 'uploads')));
app.use('/documents', express.static(path.join(ROOT_PATH, 'documents')));

/* MONGOOSE SETUP WITH GRACEFUL ERROR HANDLING */
if (!MONGO_DB_URI) {
  console.error('MongoDB URI is not defined in .env file');
  process.exit(1);
}

const connectToMongoDB = async () => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      console.log(`Attempting to connect to MongoDB...`);
      await mongoose.connect(MONGO_DB_URI);
      console.log('MongoDB connected successfully');
      break;
    } catch (error) {
      attempt += 1;
      console.error(`Error connecting to MongoDB (attempt ${attempt}/${maxRetries}):`, error.message);
      if (attempt >= maxRetries) {
        console.error('Max retry attempts reached. Exiting application...');
        process.exit(1);
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

connectToMongoDB();

/* START SERVER AFTER MONGODB CONNECTION */
app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});

/* API VERSIONING - ROUTES */
const API_VERSION = '/api/v1';

app.use(`${API_VERSION}/auth`, authRouter);
app.use(`${API_VERSION}/batches`, batchRouter);
app.use(`${API_VERSION}/teachers`, teacherRouter);
app.use(`${API_VERSION}/departments`, departementRouter);
app.use(`${API_VERSION}/students`, studentRouter);
app.use(`${API_VERSION}/categories`, categoryRouter);
app.use(`${API_VERSION}/almirahs`, almirahRouter);
app.use(`${API_VERSION}/books`, bookRouter);
app.use(`${API_VERSION}/ebooks`, eBookRouter);
app.use(`${API_VERSION}/transactions`, transactionRouter);
app.use(`${API_VERSION}/general`, genralRouter);
app.use(`${API_VERSION}/clearance`, clearanceRouter);

/* ERROR HANDLER MIDDLEWARE */
app.use(errorHandlerMiddleware);

/* Graceful shutdown of MongoDB connection on server close */
const shutdown = async () => {
  console.log('SIGINT received. Closing MongoDB connection.');
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
  console.log('Shutting down server gracefully...');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
