import { sign } from 'jsonwebtoken';

export const handleAuthToken = (options: { userId: string; email: string }): string => {
  const { userId, email } = options;

  const tokenDetails = {
    userId,
    email,
  };

  return sign(tokenDetails, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION_TIME_MS,
  });
};
