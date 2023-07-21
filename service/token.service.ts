import { IToken } from '../model/token.model';

import { TokenRepository } from '../repository/token.repository';

export class TokenService {
  private tokenRepository: TokenRepository;

  constructor() {
    this.tokenRepository = new TokenRepository();
  }

  async createToken(token): Promise<IToken> {
    return await this.tokenRepository.createToken(token);
  }

  async getToken(token): Promise<IToken> {
    return await this.tokenRepository.getToken(token);
  }

  async deleteToken(token): Promise<IToken> {
    return await this.tokenRepository.deleteToken(token);
  }
}
