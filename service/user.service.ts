import { UserRepository } from '../repository/user.repository';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(user) {
    return await this.userRepository.createUser(user);
  }

  async getUser(user) {
    return await this.userRepository.getUser(user);
  }
}
