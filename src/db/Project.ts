import mongoose, { Document, Schema } from "mongoose";
import { ITag } from "@schemas/Tag";

export interface IProject {
  _id?: string,
  name: string,
  license: string,
  releaseDate?: Date,
  description?: string,
  images?: string[],
  url?: string,
  repository?: string,
  hidden?: boolean,
  tags?: ITag["title"][],
};
type Project = Document & IProject;

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    license: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      maxlength: 5000,
      default: 'Este projeto não possui descrição no momento.',
    },
    images: [
      {
        type: String,
        lowercase: true,
        trim: true,
      }
    ],
    url: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    repository: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag'
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<Project>('Project', ProjectSchema);
