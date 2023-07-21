import { body, query } from 'express-validator';

import { UserModel } from '../model/user.model';

export const regularRegisterValidator = [
  body(['firstName', 'email', 'password'])
    .not()
    .isEmpty()
    .withMessage('Cannot be empty')
    .isString()
    .withMessage('Should be a string'),
  body('email').isEmail().withMessage('Should be a valid email address').toLowerCase(),
];

export const regularLoginValidator = [
  body(['email', 'password'])
    .not()
    .isEmpty()
    .withMessage('Cannot be empty')
    .isString()
    .withMessage('Should be a string'),
  body('email')
    .isEmail()
    .withMessage('Should be a valid email address')
    .toLowerCase()
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new Error('Account does not exist');
      }

      return true;
    }),
];

export const emailValidator = [
  query('email')
    .not()
    .isEmpty()
    .withMessage('Can not be empty')
    .isEmail()
    .withMessage('Should be a valid email address'),
];
