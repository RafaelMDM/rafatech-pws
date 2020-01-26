import mongoose, { Document, Schema } from "mongoose";

export interface ITag {
  _id?: string,
  title: string,
};
type Tag = Document & ITag;

const TagSchema = new Schema(
  {
    title: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Tag>('Tag', TagSchema);
