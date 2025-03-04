// server/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config/config';

const app: Application = express();

// Configure CORS with settings from config
app.use(cors({
  origin: config.cors.origin
}));

app.use(express.json()); // Parse JSON bodies

app.use('/api/users/v1', userRouter); // Mount API routes

// Error handling middleware
app.use(errorHandler);

export default app;