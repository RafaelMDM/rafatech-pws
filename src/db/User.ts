import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
  username: string,
  password: string,
  loggedIn?: boolean,
  lastLogin?: Date,
  generateHash: (password: string) => string,
  validatePassword: (password: string) => boolean,
}
export type User = Document & IUser;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: false,
      required: true,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.generateHash = function (password: string): string {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

UserSchema.methods.validatePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
}

export default mongoose.model<User>('User', UserSchema);
