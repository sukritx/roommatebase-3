import mongoose, { Schema } from 'mongoose';
import { IParty } from '../types';

const PartySchema = new Schema<IParty>({
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }], // Users in the party
    description: { type: String, required: true }, // Short message about expectations
    createdAt: { type: Date, default: Date.now },
});

  export default mongoose.model<IParty>("Party", PartySchema);