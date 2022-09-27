import { AuthUseCase } from "@/domain/usecases/auth-usecase";
import { EmailValidator } from "@/utils/email-validator";
import { InvalidParamError, MissingParamError } from "../errors";
import { HttpResponse } from "../helpers/http-response";
import { AuthUseCaseSpy } from "./login-router.spec";

export type HttpRequestType = {
  body: Record<string, unknown>;
};

export type HttpResponseType = {
  statusCode: number;
  body: Record<string, unknown>;
};

export class LoginRouter {
  private authUseCase: AuthUseCase | AuthUseCaseSpy;
  private emailValidator: EmailValidator;

  constructor(
    authUseCase: AuthUseCase | AuthUseCaseSpy,
    emailValidator: EmailValidator
  ) {
    this.authUseCase = authUseCase;
    this.emailValidator = emailValidator;
  }

  async route(httpRequest: HttpRequestType): Promise<HttpResponseType> {
    const { email, password } = httpRequest.body;
    if (!email)
      return HttpResponse.badRequest({
        message: new MissingParamError("email"),
      });
    if (!password)
      return HttpResponse.badRequest({
        message: new MissingParamError("password"),
      });

    try {
      if (!this?.emailValidator?.isValid(String(email)))
        return HttpResponse.badRequest({
          message: new InvalidParamError("email"),
        });

      const accessToken = await this.authUseCase.auth(
        String(email),
        String(password)
      );
      if (!accessToken) return HttpResponse.unauthorizedError();
      return HttpResponse.ok({ accessToken });
    } catch (error) {
      console.error(error);
      return HttpResponse.serverError();
    }
  }
}
