import mongoose, { Schema } from 'mongoose';
import { IParty } from '../types';

const PartySchema = new Schema<IParty>({
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  leader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  maxMembers: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["Open", "Full", "Closed"],
    default: "Open"
  },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<IParty>('Party', PartySchema);
