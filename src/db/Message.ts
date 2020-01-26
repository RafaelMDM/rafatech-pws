import mongoose, { Document, Schema } from "mongoose";

export interface IMessage {
  _id?: string,
  subject: string,
  body: string,
  completedAt?: Date,
}
type Message = Document & IMessage;

const MessageSchema = new Schema(
  {
    subject: {
      type: String,
      trim: true,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    completedAt: {
      type: Date
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Message>('Project', MessageSchema);
