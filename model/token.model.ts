import { model, Schema, Model, Document, Types } from 'mongoose';

import { IUser } from './user.model';

export interface IToken extends Document {
  userId: IUser;
  resetPasswordToken: string;
  expires: Date;
}

const TokenSchema: Schema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resetPasswordToken: {
    required: true,
    type: String,
  },
  expires: {
    type: Date,
    default: Date.now,
    expires: '72h',
  },
});

export const TokenModel: Model<IToken> = model<IToken>('Tokens', TokenSchema);
