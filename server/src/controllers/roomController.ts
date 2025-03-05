// server/controllers/roomController.ts
import { Request, Response } from 'express';
import Room from '../models/Room.model';
import { IRoom, ApiResponse, AuthRequest } from '../types';
import { FilterQuery } from 'mongoose';

// Get all rooms
export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate('owner', '-password')
      .sort({ createdAt: -1 });

    const response: ApiResponse<IRoom[]> = {
      success: true,
      data: rooms,
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

// Get room by ID
export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('owner', '-password')
      .populate('parties')
      .populate('selectedParty');

    if (!room) {
      res.status(404).json({
        success: false,
        error: 'Room not found',
      });
      return;
    }

    const response: ApiResponse<IRoom> = {
      success: true,
      data: room,
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

// Create new room
export const createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    if (!req.user.isRoomOwner) {
      res.status(403).json({
        success: false,
        error: 'Only room owners can create listings',
      });
      return;
    }

    const roomData = {
      ...req.body,
      owner: req.user._id,
      status: 'Available',
    };

    const room = await Room.create(roomData);
    await room.populate('owner', '-password');

    const response: ApiResponse<IRoom> = {
      success: true,
      data: room,
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

// Search rooms by location or coordinates
export const searchRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { location, lat, lng, radius = 5000 } = req.query;
    let query: FilterQuery<IRoom> = { isAvailable: true };

    // Search by city name
    if (location) {
      query = {
        ...query,
        location: { $regex: new RegExp(location as string, 'i') }
      };
    }
    // Search by coordinates and radius
    else if (lat && lng) {
      query = {
        ...query,
        coordinates: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng as string), parseFloat(lat as string)]
            },
            $maxDistance: parseInt(radius as string) // radius in meters
          }
        }
      };
    }

    const rooms = await Room.find(query)
      .populate('owner', '-password')
      .sort({ createdAt: -1 });

    const response: ApiResponse<IRoom[]> = {
      success: true,
      data: rooms,
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

// Update room
export const updateRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404).json({
        success: false,
        error: 'Room not found',
      });
      return;
    }

    if (room.owner.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        error: 'Only room owner can update this listing',
      });
      return;
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('owner', '-password');

    const response: ApiResponse<IRoom> = {
      success: true,
      data: updatedRoom!,
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

// Delete room
export const deleteRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404).json({
        success: false,
        error: 'Room not found',
      });
      return;
    }

    if (room.owner.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        error: 'Only room owner can delete this listing',
      });
      return;
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: null,
    });
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: (error as Error).message,
    };
    res.status(500).json(response);
  }
};