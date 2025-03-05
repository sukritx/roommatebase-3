import { Response } from 'express';
import { AuthRequest } from '../types/auth.types';
import { ApiResponse } from '../types/api.types';
import { IParty } from '../types/party.types';
import Party from '../models/Party.model';
import Room from '../models/Room.model';

// Helper function to update party status based on member count
const updatePartyStatus = (memberCount: number, maxMembers: number): "Open" | "Full" => {
  return memberCount >= maxMembers ? "Full" : "Open";
};

// Create a party for a room
export const createParty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const room = await Room.findById(req.params.roomId);
    if (!room) {
      res.status(404).json({
        success: false,
        error: 'Room not found',
      });
      return;
    }

    // Verify room is multi-tenant and available
    if (room.roomType !== 'Multi-Tenant') {
      res.status(400).json({
        success: false,
        error: 'Can only create parties for multi-tenant rooms',
      });
      return;
    }

    if (!room.isAvailable || room.status !== 'Available') {
      res.status(400).json({
        success: false,
        error: 'Room is not available for applications',
      });
      return;
    }

    // Check if user is already in a party for this room
    const existingParty = await Party.findOne({
      room: room._id,
      members: userId
    });

    if (existingParty) {
      res.status(400).json({
        success: false,
        error: 'You are already in a party for this room',
      });
      return;
    }

    // Create new party with initial status based on maxMembers
    const party = await Party.create({
      room: room._id,
      leader: userId,
      members: [userId],
      maxMembers: room.maxRoommates,
      status: updatePartyStatus(1, room.maxRoommates)
    });

    // Add party to room's partyApplications
    await Room.findByIdAndUpdate(room._id, {
      $addToSet: { partyApplications: party._id },
      status: 'Pending'
    });

    await party.populate([
      { path: 'leader', select: '-password' },
      { path: 'members', select: '-password' },
      { path: 'room' }
    ]);

    const response: ApiResponse<IParty> = {
      success: true,
      data: party,
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

// Join an existing party
export const joinParty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const party = await Party.findById(req.params.partyId);
    if (!party) {
      res.status(404).json({
        success: false,
        error: 'Party not found',
      });
      return;
    }

    // Check party status
    if (party.status !== 'Open') {
      res.status(400).json({
        success: false,
        error: 'Party is not open for new members',
      });
      return;
    }

    // Check if user is already a member
    if (party.members.some(memberId => memberId.toString() === userId.toString())) {
      res.status(400).json({
        success: false,
        error: 'You are already a member of this party',
      });
      return;
    }

    // Check if user is in another party for the same room
    const existingParty = await Party.findOne({
      room: party.room,
      members: userId,
      _id: { $ne: party._id }
    });

    if (existingParty) {
      res.status(400).json({
        success: false,
        error: 'You are already in another party for this room',
      });
      return;
    }

    // Add member and update status
    const newMemberCount = party.members.length + 1;
    const updatedParty = await Party.findByIdAndUpdate(
      party._id,
      { 
        $addToSet: { members: userId },
        status: updatePartyStatus(newMemberCount, party.maxMembers)
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'leader', select: '-password' },
      { path: 'members', select: '-password' },
      { path: 'room' }
    ]);

    const response: ApiResponse<IParty> = {
      success: true,
      data: updatedParty!,
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

// Leave a party
export const leaveParty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const party = await Party.findById(req.params.partyId);
    if (!party) {
      res.status(404).json({
        success: false,
        error: 'Party not found',
      });
      return;
    }

    // Check if user is a member
    if (!party.members.some(memberId => memberId.toString() === userId.toString())) {
      res.status(400).json({
        success: false,
        error: 'You are not a member of this party',
      });
      return;
    }

    // If leader is leaving and there are other members, assign new leader
    let update: any = { 
      $pull: { members: userId },
      status: updatePartyStatus(party.members.length - 1, party.maxMembers)
    };
    
    if (party.leader.toString() === userId.toString() && party.members.length > 1) {
      const newLeader = party.members.find(memberId => memberId.toString() !== userId.toString());
      update.$set = { leader: newLeader };
    } else if (party.leader.toString() === userId.toString()) {
      // If leader is leaving and no other members, delete party and remove from room
      await Party.findByIdAndDelete(party._id);
      await Room.findByIdAndUpdate(party.room, {
        $pull: { partyApplications: party._id }
      });
      
      res.json({
        success: true,
        data: null,
      });
      return;
    }

    // Update party
    const updatedParty = await Party.findByIdAndUpdate(
      party._id,
      update,
      { new: true, runValidators: true }
    ).populate([
      { path: 'leader', select: '-password' },
      { path: 'members', select: '-password' },
      { path: 'room' }
    ]);

    const response: ApiResponse<IParty> = {
      success: true,
      data: updatedParty!,
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