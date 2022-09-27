import { AuthUseCase } from "@/domain/usecases/auth-usecase";
import { TokenGeneratorSpy } from "@/domain/usecases/auth-usecase.spec";
import { LoadUserByEmailRepository } from "@/infra/repositories/load-user-repository";
import { UpdateAccessTokenRepository } from "@/infra/repositories/update-access-token-repository";
import { LoginRouter as LoginRoute } from "@/presentation/routers/login-router";
import { EmailValidator } from "@/utils/email-validator";
import { Encrypter } from "@/utils/encrypter";

export class LoginRouterComposer {
  static compose() {
    const loadUserByEmailRepository = new LoadUserByEmailRepository();
    const updateAccessTokenRepository = new UpdateAccessTokenRepository();
    const encrypter = new Encrypter();
    const tokenGenerator = new TokenGeneratorSpy();

    const emailValidator = new EmailValidator();
    const authUseCase = new AuthUseCase({
      loadUserByEmailRepository,
      updateAccessTokenRepository,
      encrypterHelper: encrypter,
      tokenGenerator,
    });

    return new LoginRoute(authUseCase, emailValidator);
  }
}
