import mongoose, { Document } from 'mongoose';

export interface IRoom extends Document {
    owner: mongoose.ObjectId;
    title: string;
    description: string;
    location: string; // City name (e.g., "Oslo")
    address?: string; // Optional exact address
    coordinates?: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
    price: number;
    deposit: number;
    leaseTerm: string;
    utilitiesIncluded: boolean;
    billsEstimate?: number;
    availableFrom: Date;
    isFurnished: boolean;
    amenities?: string[];
    photos?: string[];
    totalRooms: number;
    bathrooms: number;
    maxRoommates: number;
    rules?: string[];
    publicTransport?: string; // E.g., "10 min walk to metro"
    isAvailable: boolean;
    roomType: "Single-Tenant" | "Multi-Tenant";
    // Applications based on room type
    singleTenantApplications: mongoose.ObjectId[]; // Individual user applications for single-tenant rooms
    partyApplications: mongoose.ObjectId[]; // Party applications for multi-tenant rooms
    selectedApplicant?: mongoose.ObjectId; // Selected user (for single-tenant) or party (for multi-tenant)
    status: "Available" | "Pending" | "Taken"; // Room availability status
    createdAt: Date;
}