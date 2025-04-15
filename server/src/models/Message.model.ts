import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../types';

const MessageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    messageType: { type: String, enum: ["Text", "Image", "File"], default: "Text" },
    status: { type: String, enum: ["Sent", "Delivered", "Read"], default: "Sent" },
    createdAt: { type: Date, default: Date.now }
  });

export default mongoose.model<IMessage>('Message', MessageSchema);
