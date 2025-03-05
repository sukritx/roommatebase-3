// server/controllers/roomController.ts
import { Request, Response } from 'express';
import Room from '../models/Room.model';
import Party from '../models/Party.model';
import { IRoom, ApiResponse, AuthRequest } from '../types';
import { FilterQuery } from 'mongoose';

// Get all rooms
export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate('owner', '-password')
      .populate('singleTenantApplications', '-password')
      .populate('partyApplications')
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
      .populate('singleTenantApplications', '-password')
      .populate('partyApplications')
      .populate({
        path: 'selectedApplicant',
        select: '-password'
      });

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
      singleTenantApplications: [],
      partyApplications: [],
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
      .populate('singleTenantApplications', '-password')
      .populate('partyApplications')
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
    ).populate('owner', '-password')
    .populate('singleTenantApplications', '-password')
    .populate('partyApplications');

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

// Apply for a room
export const applyForRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
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

    // Check if room is available
    if (!room.isAvailable || room.status !== 'Available') {
      res.status(400).json({
        success: false,
        error: 'Room is not available for applications',
      });
      return;
    }

    // Check if room is single-tenant type
    if (room.roomType !== 'Single-Tenant') {
      res.status(400).json({
        success: false,
        error: 'Can only apply directly to single-tenant rooms. For multi-tenant rooms, please join or create a party.',
      });
      return;
    }

    // Check if user has already applied
    const hasApplied = room.singleTenantApplications.some(
      applicantId => applicantId.toString() === userId.toString()
    );

    if (hasApplied) {
      res.status(400).json({
        success: false,
        error: 'You have already applied for this room',
      });
      return;
    }

    // For single-tenant rooms, add the user to singleTenantApplications
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { 
        $addToSet: { singleTenantApplications: userId },
        status: 'Pending'
      },
      { new: true }
    )
    .populate('owner', '-password')
    .populate('singleTenantApplications', '-password'); // Populate applicants without passwords

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

// Select tenant for single-tenant room
export const selectTenant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const { tenantId } = req.body;
    if (!tenantId) {
      res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
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

    // Verify owner
    if (room.owner.toString() !== userId.toString()) {
      res.status(403).json({
        success: false,
        error: 'Only room owner can select tenants',
      });
      return;
    }

    // Verify room type
    if (room.roomType !== 'Single-Tenant') {
      res.status(400).json({
        success: false,
        error: 'Can only select tenants for single-tenant rooms',
      });
      return;
    }

    // Verify tenant has applied
    if (!room.singleTenantApplications.some(id => id.toString() === tenantId)) {
      res.status(400).json({
        success: false,
        error: 'Selected user has not applied for this room',
      });
      return;
    }

    // Update room with selected tenant
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        selectedApplicant: tenantId,
        status: 'Taken',
        isAvailable: false
      },
      { new: true }
    )
    .populate('owner', '-password')
    .populate('singleTenantApplications', '-password')
    .populate('selectedApplicant', '-password');

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

// Select party for multi-tenant room
export const selectParty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const { partyId } = req.body;
    if (!partyId) {
      res.status(400).json({
        success: false,
        error: 'Party ID is required',
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

    // Verify owner
    if (room.owner.toString() !== userId.toString()) {
      res.status(403).json({
        success: false,
        error: 'Only room owner can select parties',
      });
      return;
    }

    // Verify room type
    if (room.roomType !== 'Multi-Tenant') {
      res.status(400).json({
        success: false,
        error: 'Can only select parties for multi-tenant rooms',
      });
      return;
    }

    // Verify party has applied
    if (!room.partyApplications.some(id => id.toString() === partyId)) {
      res.status(400).json({
        success: false,
        error: 'Selected party has not applied for this room',
      });
      return;
    }

    // Get party to verify member count
    const party = await Party.findById(partyId);
    if (!party) {
      res.status(404).json({
        success: false,
        error: 'Selected party not found',
      });
      return;
    }

    if (party.members.length !== room.maxRoommates) {
      res.status(400).json({
        success: false,
        error: `Party must have exactly ${room.maxRoommates} members`,
      });
      return;
    }

    // Close the selected party
    await Party.findByIdAndUpdate(partyId, { status: 'Closed' });

    // Update room with selected party
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        selectedApplicant: partyId,
        status: 'Taken',
        isAvailable: false
      },
      { new: true }
    )
    .populate('owner', '-password')
    .populate('partyApplications')
    .populate({
      path: 'selectedApplicant',
      populate: {
        path: 'members',
        select: '-password'
      }
    });

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

    // Check if there are any pending applications
    if (room.status === 'Pending' && 
        (room.singleTenantApplications.length > 0 || room.partyApplications.length > 0)) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete room with pending applications',
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