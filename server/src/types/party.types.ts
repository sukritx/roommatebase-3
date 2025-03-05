import mongoose, { Document } from 'mongoose';

export interface IParty extends Document {
  room: mongoose.ObjectId;
  leader: mongoose.ObjectId;
  members: mongoose.ObjectId[];
  maxMembers: number;
  status: "Open" | "Full" | "Closed";
  createdAt: Date;
}
