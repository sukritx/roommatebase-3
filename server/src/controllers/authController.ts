import { Request, Response } from 'express';
import User from '../models/User.model';
import { IUser, ApiResponse } from '../types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/authMiddleware';

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';

// Signup function
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User already exists',
      };
      res.status(400).json(response);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      isRoomOwner: false,
      listedRooms: [],
      favoriteRooms: []
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: '1h' });

    const response: ApiResponse<{ token: string; user: IUser }> = {
      success: true,
      data: { 
        token,
        user: newUser
      },
    };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: (error as Error).message,
    };
    res.status(500).json(response);
  }
};

// Signin function
export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid email or password',
      };
      res.status(400).json(response);
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid email or password',
      };
      res.status(400).json(response);
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

    const response: ApiResponse<{ token: string; user: IUser }> = {
      success: true,
      data: { 
        token,
        user
      },
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: (error as Error).message,
    };
    res.status(500).json(response);
  }
};

// Get logged-in user details
export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    
    if (!user) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'User not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<IUser> = {
      success: true,
      data: user,
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: (error as Error).message,
    };
    res.status(500).json(response);
  }
};