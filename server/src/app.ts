// server/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter';
import authRouter from './routes/authRouter';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config/config';

const app: Application = express();

// Configure CORS with settings from config
app.use(cors({
  origin: config.cors.origin
}));

app.use(express.json()); // Parse JSON bodies

// API Routes
app.use('/api/auth/v1', authRouter);
app.use('/api/users/v1', userRouter);

// Error handling middleware
app.use(errorHandler);

export default app;