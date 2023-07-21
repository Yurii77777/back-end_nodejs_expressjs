import { connect } from '../config/db.config';
import { IToken, TokenModel } from '../model/token.model';
import { APILogger } from '../logger/api.logger';

export class TokenRepository {
  private logger: APILogger;

  constructor() {
    connect();
    this.logger = new APILogger();
  }

  async createToken(token: any): Promise<IToken> {
    let data: null | IToken = null;

    try {
      data = await TokenModel.create(token);
    } catch (err) {
      this.logger.error('Error::' + err);
    }

    return data;
  }

  async getToken(token: any): Promise<IToken> {
    let data: null | IToken = null;

    try {
      data = await TokenModel.findOne(token);
    } catch (err) {
      this.logger.error('Error::' + err);
    }

    return data;
  }

  async deleteToken(token: any): Promise<any> {
    let data: any = {};

    try {
      data = await TokenModel.deleteOne(token);
    } catch (err) {
      this.logger.error('Error::' + err);
    }

    return { status: `${data.deletedCount > 0 ? true : false}` };
  }
}
