import mongoose, { Schema } from 'mongoose';
import { IRoom } from '../types';

const RoomSchema = new Schema<IRoom>({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true }, // City name for easy search (e.g., "Oslo")
    address: { type: String }, // Exact address (optional)
    coordinates: { // Enables location-based filtering
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" } // [longitude, latitude]
    },
    price: { type: Number, required: true },
    deposit: { type: Number, required: true },
    leaseTerm: { type: String, required: true },
    utilitiesIncluded: { type: Boolean, default: false },
    billsEstimate: { type: Number },
    availableFrom: { type: Date, required: true },
    isFurnished: { type: Boolean, default: false },
    amenities: { type: [String] },
    photos: { type: [String] },
    totalRooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    maxRoommates: { type: Number, required: true },
    rules: { type: [String] },
    publicTransport: { type: String }, // Transport details (e.g., "10 min walk to metro")
    isAvailable: { type: Boolean, default: true },
    roomType: { type: String, enum: ["Single-Tenant", "Multi-Tenant"], required: true },
    // Applications based on room type
    singleTenantApplications: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }], // For single-tenant rooms
    partyApplications: [{ type: Schema.Types.ObjectId, ref: "Party", default: [] }], // For multi-tenant rooms
    selectedApplicant: { type: Schema.Types.ObjectId, refPath: 'roomType' }, // References User or Party based on roomType
    status: { type: String, enum: ["Available", "Pending", "Taken"], default: "Available" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IRoom>('Room', RoomSchema);