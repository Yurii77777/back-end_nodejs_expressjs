import { body } from 'express-validator';

import { UserModel } from '../model/user.model';

const regularRegisterValidator = [
  body(['firstName', 'email', 'password'])
    .not()
    .isEmpty()
    .withMessage('Cannot be empty')
    .isString()
    .withMessage('Should be a string'),
  body('email').isEmail().withMessage('Should be a valid email address').toLowerCase(),
];

const regularLoginValidator = [
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

export { regularRegisterValidator, regularLoginValidator };
