import {
  InvalidParamError,
  MissingParamError,
  ServerError,
  UnauthorizedError,
} from "../errors";
import { LoginRouter } from "./login-router";

export class AuthUseCaseSpy {
  email = "";
  password = "";
  accessToken = "valid_token";

  async auth(email: string, password: string) {
    this.email = email;
    this.password = password;
    return this.accessToken;
  }
}

export class EmailValidatorSpy {
  isEmailValid = true;
  email = "";

  isValid(email: string) {
    this.email = email;
    return this.isEmailValid;
  }
}

const makeSut = () => {
  const authUseCaseSpy = new AuthUseCaseSpy();
  const emailValidatorSpy = new EmailValidatorSpy();
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy,
  };
};

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    email = "";
    password = "";
    accessToken = "valid_token";

    async auth(email: string, password: string) {
      throw new Error();
      return email + password;
    }
  }
  return new AuthUseCaseSpy();
};

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isEmailValid = true;
    email = "";

    isValid(email: string) {
      this.email = email;
      throw new Error();
      return this.isEmailValid;
    }
  }
  return new EmailValidatorSpy();
};

describe("Login router", () => {
  test("should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.message).toEqual(new MissingParamError("email"));
  });
  test("should return 400 if invalid email is provided", async () => {
    const { sut, emailValidatorSpy } = makeSut();
    emailValidatorSpy.isEmailValid = false;
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "valid_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.message).toEqual(new InvalidParamError("email"));
  });
  test("should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any@email.com",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.message).toEqual(
      new MissingParamError("password")
    );
  });
  test("should call AuthUseCase with correct params", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "any@email.com",
        password: "any_password",
      },
    };
    sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });
  test("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "any@email.com",
        password: "any_password",
      },
    };
    sut.route(httpRequest);
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
  });
  test("should return 401 when invalid credentials are provided", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = "";
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "invalid_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body.message).toEqual(new UnauthorizedError());
  });
  test("should return 200 when valid credentials are provided", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "valid@email.com",
        password: "valid_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });
  test("should return 500 if AuthUseCase throws", async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError();
    const emailValidatorSpy = new EmailValidatorSpy();
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
    const httpRequest = {
      body: {
        email: "valid@email.com",
        password: "valid_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.message).toEqual(new ServerError());
  });
  test("should return 500 if EmailValidator throws", async () => {
    const emailValidatorSpy = makeEmailValidatorWithError();
    const authUseCaseSpy = new AuthUseCaseSpy();
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);
    const httpRequest = {
      body: {
        email: "valid@email.com",
        password: "valid_password",
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.message).toEqual(new ServerError());
  });
});
