import mongoose, { Document } from 'mongoose';

export interface IRoom extends Document {
    owner: mongoose.ObjectId;
    
    // Property Information
    category: "Apartment" | "City house" | "Club room" | "Condominium" | "Detached Single Family House" | "Double house" | "Half double house" | "Housing Cooperative" | "Multi family house" | "Parcel house" | "Small house" | "Summer house" | "Townhouse" | "Villa" | "Youth Housing";
    images: string[];
    title: string;
    description: string;
    location: string; // City name for search (e.g., "Oslo")
    address?: string; // Exact address (optional)
    coordinates?: {
      type: "Point";
      coordinates: [number, number]; // [longitude, latitude]
    };
    size: number; // Size in square meters
    rooms: number; // Number of rooms
    floor?: number; // Floor number
    furnished: boolean;
    shareable: boolean;
    
    // Rental Information
    rentalPeriod: "1-11 months" | "12-23 months" | "24+ months" | "Unlimited";
    availableFrom: "Specific Date" | "As soon as possible";
    availableDate?: Date; // Used when "Specific Date" is selected
    price: number;
    utilities: number; // Additional utility costs
    deposit: number;
    prepaidRent: number;
    moveInPrice: number; // Calculated (price + deposit + prepaidRent)

    // Lifestyle & Facilities
    petsAllowed: boolean;
    elevator: boolean;
    seniorFriendly: boolean;
    studentsOnly: boolean;
    balcony: boolean;
    parking: boolean;
    dishwasher: boolean;
    washingMachine: boolean;
    electricChargingStation: boolean;
    dryer: boolean;
    energyRating: string; // Can be A, B, C, D, etc.

    // Applications based on room type
    roomType: "Single-Tenant" | "Multi-Tenant";
    singleTenantApplications: mongoose.ObjectId[]; // For single-tenant rooms
    partyApplications: mongoose.ObjectId[]; // For multi-tenant rooms
    selectedApplicant?: mongoose.ObjectId; // References User or Party based on roomType
    status: "Available" | "Pending" | "Taken";
    lastUpdated: Date;

    // Contact & Digital Showing
    contactOptions: {
        byMessage: boolean;
        byPhone: boolean;
        phoneNumber?: string;
    };
    digitalShowing: boolean;

    createdAt: Date;
}