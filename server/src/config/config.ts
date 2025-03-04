import dotenv from 'dotenv';
import { ConnectOptions } from 'mongoose';
import { Config } from '../types';

// Load environment variables
dotenv.config();

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/boilerplate',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
};