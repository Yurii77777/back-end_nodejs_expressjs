import { model, Schema, Model, Document } from 'mongoose';
import validator from 'validator';
import { hashSync, compare } from 'bcrypt';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  isActive: boolean;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      set: (firstName: string) => firstName.toLowerCase(),
    },
    lastName: {
      type: String,
      required: false,
      minLength: 2,
      maxLength: 50,
      set: (lastName: string) => lastName.toLowerCase(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: (email: string) => validator.isEmail(email),
      set: (email: string) => email.toLowerCase(),
    },
    password: {
      type: String,
      required: true,
      unique: false,
      set: (password: any) => hashSync(password, 10),
    },
    isActive: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

UserSchema.methods.comparePassword = async function (userPassword, next) {
  try {
    let user = <IUser>this;
    let isMatch = await compare(userPassword, user.password);
    return isMatch;
  } catch (error) {
    return next(error);
  }
};

export const UserModel: Model<IUser> = model<IUser>('User', UserSchema);
