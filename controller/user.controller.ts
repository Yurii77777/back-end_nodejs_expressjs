import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';

import { IUser } from '../model/user.model';

import { UserService } from '../service/user.service';
import { APILogger } from '../logger/api.logger';

import { handleResponse } from '../utils/handleResponse';

export class UserController {
  private userService: UserService;
  private logger: APILogger;

  constructor() {
    this.userService = new UserService();
    this.logger = new APILogger();
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.info('Controller: createUser', req.body);

      const { email } = req.body;
      const user: null | IUser = await this.userService.getUser({ email });

      if (user) {
        const { email, _id: userId } = user;

        const tokenDetails = {
          userId,
          email,
        };

        const token = sign(tokenDetails, process.env.JWT_SECRET, {
          expiresIn: process.env.TOKEN_EXPIRATION_TIME_MS,
        });

        return handleResponse(res, 201, 'User created successfully', {
          user,
          token,
          ttl: process.env.TOKEN_EXPIRATION_TIME_MS,
        });
      }

      const userData = req.body;
      const createdUserData = await this.userService.createUser(userData);
      const { email: userEmail, _id: userId } = createdUserData;

      const tokenDetails = {
        userId,
        email: userEmail,
      };

      const token = sign(tokenDetails, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION_TIME_MS,
      });

      return handleResponse(res, 201, 'User created successfully', {
        user: createdUserData,
        token,
        ttl: process.env.TOKEN_EXPIRATION_TIME_MS,
      });
    } catch (error) {
      return next(error);
    }
  }
}
