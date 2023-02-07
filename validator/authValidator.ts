import { body } from 'express-validator';

const regularRegisterValidator = [
  body(['firstName', 'email', 'password'])
    .not()
    .isEmpty()
    .withMessage('Cannot be empty')
    .isString()
    .withMessage('Should be a string'),
  body('email').isEmail().withMessage('Should be a valid email address').toLowerCase(),
];

export { regularRegisterValidator };
