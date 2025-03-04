import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  location?: string;
  bio?: string;
  budget?: number;
  preferredRoommateGender?: "Male" | "Female" | "Other" | "Any";
  interests?: string[];
  isSmoker?: boolean;
  hasPet?: boolean;
  occupation?: string;
  isRoomOwner: boolean;
  listedRooms: mongoose.ObjectId[];
  joinedParty?: mongoose.ObjectId;
  instagram?: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}
