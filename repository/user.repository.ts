import { connect } from '../config/db.config';
import { IUser, UserModel } from '../model/user.model';
import { APILogger } from '../logger/api.logger';

export class UserRepository {
  private logger: APILogger;

  constructor() {
    connect();
    this.logger = new APILogger();
  }

  async createUser(user): Promise<IUser> {
    let data: null | IUser = null;

    try {
      data = await UserModel.create(user);
    } catch (error) {
      this.logger.error('Error::' + error);
    }

    return data;
  }

  async getUser(user): Promise<IUser> {
    let data: null | IUser = null;

    try {
      data = await UserModel.findOne(user);
    } catch (error) {
      this.logger.error('Error::' + error);
    }

    return data;
  }
}
