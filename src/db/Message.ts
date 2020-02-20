import mongoose, { Document, Schema } from "mongoose";

export interface IMessage {
  _id?: string,
  from: string,
  subject: string,
  body: string,
  completedAt?: Date,
}
type Message = Document & IMessage;

const MessageSchema = new Schema(
  {
    from: {
      type: String,
      trim: true,
      required: true,
    },
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

export default mongoose.model<Message>('Message', MessageSchema);
