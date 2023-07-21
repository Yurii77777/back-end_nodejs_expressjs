import { Request, Response, NextFunction } from 'express';
import randomatic from 'randomatic';

import { IUser } from '../model/user.model';

import { APILogger } from '../logger/api.logger';
import { UserService } from '../service/user.service';
import { TokenService } from '../service/token.service';

import { handleResponse } from '../utils/handleResponse';
import { handleAuthToken } from '../utils/handleAuthToken';
import { sendMail } from '../utils/sendMail';

export class UserController {
  private userService: UserService;
  private tokenService: TokenService;
  private logger: APILogger;

  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
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

  async regularLogin(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.info('Controller: regularLogin', req.body);
      const { email, password } = req.body;

      const user = await this.userService.getUser({ email });

      if (!user) {
        return handleResponse(res, 404, 'No account found');
      }

      const match = await user.comparePassword(password);

      if (!match) {
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

  async handleResetPassword(req: Request, res: Response, next: NextFunction) {
    this.logger.info('Controller: handleResetPassword', req.query);

    try {
      const email: string = req.query.email as string;

      const user = await this.userService.getUser({ email });

      if (!user) {
        return handleResponse(res, 404, 'No account found', {});
      }

      const { _id: userId } = user;

      const resetToken = await this.tokenService.createToken({
        userId,
        resetPasswordToken: `${randomatic('0a', 32)}`,
      });

      const resetUrl = `${process.env.PASSWORD_CHANGE_URL}?token=${resetToken.resetPasswordToken}`;

      const mailContent = {
        from: process.env.SENDGRID_FROM_ADDRESS,
        to: email,
        subject: 'Посилання для зкидання паролю',
        text: `Щоб зкинути пароль, перейдіть, будь-ласка, по даному посиланню: ${resetUrl}`,
      };

      const sent = await sendMail(mailContent);

      if (!sent) {
        return handleResponse(res, 500, 'Error sending mail', {});
      }

      return handleResponse(res, 200, 'Password reset email sent successfully', {});
    } catch (error) {
      return next(error);
    }
  }
}
