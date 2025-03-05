// server/controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/User.model';
import { IUser, ApiResponse, AuthRequest } from '../types';

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

// Get user profile by ID
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const response: ApiResponse<IUser> = {
      success: true,
      data: user,
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

// Update user profile
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.password;
    delete updates.email;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const response: ApiResponse<IUser> = {
      success: true,
      data: user,
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

// Add room to favorites
export const addToFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteRooms: roomId } },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const response: ApiResponse<IUser> = {
      success: true,
      data: user,
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

// Remove room from favorites
export const removeFromFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteRooms: roomId } },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const response: ApiResponse<IUser> = {
      success: true,
      data: user,
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

// Get all favorite rooms
export const getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const user = await User.findById(userId)
      .select('favoriteRooms')
      .populate('favoriteRooms');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const response: ApiResponse<typeof user.favoriteRooms> = {
      success: true,
      data: user.favoriteRooms,
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