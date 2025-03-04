/**
 * Interface representing a user in the system
 */
export interface IUser {
  _id: string;
  email: string;
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
  listedRooms: string[];
  joinedParty?: string;
  instagram?: string;
  createdAt: Date;
}