import mongoose, { Document } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.ObjectId;
  recipient: mongoose.ObjectId;
  content: string;
  messageType: "Text" | "Image" | "File";
  status: "Sent" | "Delivered" | "Read";
  createdAt: Date;
}
