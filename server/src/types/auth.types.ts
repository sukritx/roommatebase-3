import { Request } from 'express';
import { IUser } from './user.types';

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  userId: string;
  email: string;
}
