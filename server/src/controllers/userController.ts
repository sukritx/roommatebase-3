// server/controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/User.model';
import { IUser, ApiResponse } from '../types';

// Existing getUsers function
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: IUser[] = await User.find();
    const response: ApiResponse<IUser[]> = {
      success: true,
      data: users,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: (error as Error).message,
    };
    res.status(500).json(response);
  }
};