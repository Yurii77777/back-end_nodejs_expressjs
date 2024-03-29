import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');

import { APILogger } from './logger/api.logger';

import { UserController } from './controller/user.controller';

import { regularRegisterValidator, regularLoginValidator, emailValidator } from './validator/authValidator';
import validate from './validator/validate';

class App {
  public express: express.Application;
  public logger: APILogger;
  public userController: UserController;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.logger = new APILogger();
    this.userController = new UserController();
  }

  private middleware() {
    const corsOptions = {
      origin: '*',
      credentials: true, //access-control-allow-credentials:true
      optionSuccessStatus: 200,
    };

    this.express.use(cors(corsOptions));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.express.post('/api/user', regularRegisterValidator, validate, (req, res, next) => {
      this.userController.createUser(req, res, next);
    });

    this.express.post('/api/user/login', regularLoginValidator, validate, (req, res, next) => {
      this.userController.regularLogin(req, res, next);
    });

    this.express.get('/api/user/forgot-password', emailValidator, validate, (req, res, next) => {
      this.userController.handleResetPassword(req, res, next);
    });
  }
}

export default new App().express;
