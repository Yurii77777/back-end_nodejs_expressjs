import { Request, Response, NextFunction } from 'express';

import { IUser } from '../model/user.model';

import { UserService } from '../service/user.service';
import { APILogger } from '../logger/api.logger';

import { handleResponse } from '../utils/handleResponse';
import { handleAuthToken } from '../utils/handleAuthToken';

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

      const { email, password } = req.body;
      const user: null | IUser = await this.userService.getUser({ email });

      if (!user) {
        const userData = req.body;
        const createdUserData = await this.userService.createUser(userData);
        const { email, _id: userId } = createdUserData;

        const token = handleAuthToken({ userId, email });

        return handleResponse(res, 201, 'User created successfully', {
          user: createdUserData,
          token,
          ttl: process.env.TOKEN_EXPIRATION_TIME_MS,
        });
      }

      // Check user password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return handleResponse(res, 400, 'Incorrect password');
      }

      const { _id: userId, email: userEmail } = user;
      const token = handleAuthToken({ userId, email: userEmail });

      return handleResponse(res, 200, 'User retrieved successfully', {
        user,
        token,
        ttl: process.env.TOKEN_EXPIRATION_TIME_MS,
      });
    } catch (error) {
      return next(error);
    }
  }
}
