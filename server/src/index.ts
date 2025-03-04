// server/index.ts
import app from './app';
import connectDB from './config/db';
import { config } from './config/config';

const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
  });
};

startServer();