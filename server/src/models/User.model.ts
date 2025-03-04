// server/models/User.ts
import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  profilePicture: { type: String, default: "" },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  location: { type: String },
  bio: { type: String },
  budget: { type: Number },
  preferredRoommateGender: { type: String, enum: ["Male", "Female", "Other", "Any"], default: "Any" },
  interests: { type: [String] },
  isSmoker: { type: Boolean, default: false },
  hasPet: { type: Boolean, default: false },
  occupation: { type: String },
  isRoomOwner: { type: Boolean, default: false },
  listedRooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  joinedParty: { type: Schema.Types.ObjectId, ref: "Party" },
  instagram: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);