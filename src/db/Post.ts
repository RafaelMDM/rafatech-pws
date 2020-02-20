import mongoose, { Document, Schema } from "mongoose";
import { ITag } from "../db/Tag";

export interface IPost {
  _id?: string,
  author: string,
  title: string,
  publishDate?: Date,
  published?: boolean,
  thumbnail?: string,
  body?: string,
  tags?: ITag["title"][],
};
type Post = Document & IPost;

const PostSchema = new Schema(
  {
    author: {
      type: String,
      trim: true,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    publishDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    published: {
      type: Boolean,
      default: true,
    },
    thumbnail: {
      type: String,
      trim: true,
      default: null, //! Alterar para a url de uma imagem genérica?
    },
    body: {
      type: String,
      trim: true,
      required: true,
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

export default mongoose.model<Post>('Post', PostSchema);
