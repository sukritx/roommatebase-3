import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types';

const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Authentication required',
      };
      res.status(401).json(response);
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    req.user = decoded;
    next();
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Invalid token',
    };
    res.status(401).json(response);
  }
};