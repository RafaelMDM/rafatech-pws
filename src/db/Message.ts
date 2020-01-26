import mongoose, { Document, Schema } from "mongoose";

type Message = Document & {};

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
