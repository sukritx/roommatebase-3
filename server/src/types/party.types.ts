import mongoose, { Document } from 'mongoose';

export interface IParty extends Document {
    room: mongoose.Types.ObjectId;
    creator: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    description: string;
    createdAt: Date;
}
