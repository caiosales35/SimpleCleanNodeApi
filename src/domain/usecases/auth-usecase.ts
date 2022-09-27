import { LoadUserByEmailRepository } from "@/infra/repositories/load-user-repository";
import { UpdateAccessTokenRepository } from "@/infra/repositories/update-access-token-repository";
import { Encrypter } from "@/utils/encrypter";
import {
  EncrypterHelperSpy,
  LoadUserByEmailRepositorySpy,
  TokenGeneratorSpy,
  UpdateAccessTokenRepositorySpy,
} from "./auth-usecase.spec";

type AuthUseCaseParams = {
  loadUserByEmailRepository:
    | LoadUserByEmailRepositorySpy
    | LoadUserByEmailRepository;
  encrypterHelper: EncrypterHelperSpy | Encrypter;
  tokenGenerator: TokenGeneratorSpy;
  updateAccessTokenRepository:
    | UpdateAccessTokenRepositorySpy
    | UpdateAccessTokenRepository;
};

export class AuthUseCase {
  loadUserByEmailRepository:
    | LoadUserByEmailRepositorySpy
    | LoadUserByEmailRepository;
  encrypterHelper: EncrypterHelperSpy | Encrypter;
  tokenGenerator: TokenGeneratorSpy;
  updateAccessTokenRepository:
    | UpdateAccessTokenRepositorySpy
    | UpdateAccessTokenRepository;

  constructor({
    loadUserByEmailRepository,
    encrypterHelper,
    tokenGenerator,
    updateAccessTokenRepository,
  }: AuthUseCaseParams) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
    this.encrypterHelper = encrypterHelper;
    this.tokenGenerator = tokenGenerator;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  async auth(email: string, password: string) {
    const user = await this.loadUserByEmailRepository.load(email);
    const isValid =
      user && (await this.encrypterHelper.compare(password, user.password));
    if (isValid) {
      const accessToken = await this.tokenGenerator.generate(user._id);
      await this.updateAccessTokenRepository.update(user._id, accessToken);
      return accessToken;
    }
    return null;
  }
}
