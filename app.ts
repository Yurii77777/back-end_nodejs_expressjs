import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');

import { APILogger } from './logger/api.logger';

class App {
  public express: express.Application;
  public logger: APILogger;

  constructor() {
    this.express = express();
    this.routes();
    this.middleware();
    this.logger = new APILogger();
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
    this.express.post('/api/user', (req, res, next) => {
      res.send("it's ok");
    });
  }
}

export default new App().express;
