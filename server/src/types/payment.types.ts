import { Document, Types } from 'mongoose';

// Payment type enum
export enum PaymentType {
  User = 'User',
  Landlord = 'Landlord'
}

// Payment status enum
export enum PaymentStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed'
}

// Payment interface
export interface IPayment extends Document {
  user: Types.ObjectId;
  paymentType: PaymentType;
  amount: number;
  status: PaymentStatus;
  stripePaymentId: string;
  createdAt: Date;
}

// Payment creation DTO
export interface CreatePaymentDto {
  user: string;
  paymentType: PaymentType;
  amount: number;
  stripePaymentId: string;
}

// Payment update DTO
export interface UpdatePaymentDto {
  status?: PaymentStatus;
}
