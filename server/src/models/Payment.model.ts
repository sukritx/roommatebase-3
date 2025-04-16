import mongoose, { Schema } from 'mongoose';
import { IPayment, PaymentType, PaymentStatus } from '../types';

const PaymentSchema = new Schema<IPayment>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentType: { type: String, enum: Object.values(PaymentType), required: true, default: PaymentType.User },
    amount: { type: Number, required: true },
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.Pending },
    stripePaymentId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
