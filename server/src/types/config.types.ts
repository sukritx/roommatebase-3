import { ConnectOptions } from 'mongoose';

export interface Config {
  env: string;
  port: number;
  mongodb: {
    uri: string;
    options: ConnectOptions;
  };
  cors: {
    origin: string;
  };
}
