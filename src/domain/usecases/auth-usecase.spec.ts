import { AuthUseCase } from "./auth-usecase";

export class LoadUserByEmailRepositorySpy {
  email = "";
  user: Record<string, string> | null = {
    password: "hashed_password",
    id: "any_id",
  };

  async load(email: string) {
    this.email = email;
    return this.user;
  }
}

class LoadUserByEmailRepositoryWithError {
  email = "";
  user: Record<string, string> | null = {
    password: "hashed_password",
    id: "any_id",
  };

  async load(email: string) {
    this.email = email;
    throw new Error();
    return this.user;
  }
}

export class EncrypterHelperSpy {
  password = "";
  hashedPassword = "";
  isValid = true;

  async compare(password: string, hashedPassword: string) {
    this.password = password;
    this.hashedPassword = hashedPassword;
    return this.isValid;
  }
}

class EncrypterHelperWithError {
  password = "";
  hashedPassword = "";
  isValid = true;

  async compare(password: string, hashedPassword: string) {
    this.password = password;
    this.hashedPassword = hashedPassword;
    throw new Error();
    return this.isValid;
  }
}

export class TokenGeneratorSpy {
  userId = "";
  accessToken = "any_token";

  async generate(userId: string) {
    this.userId = userId;
    return this.accessToken;
  }
}

class TokenGeneratorWithError {
  userId = "";
  accessToken = "any_token";

  async generate(userId: string) {
    this.userId = userId;
    throw new Error();
    return this.accessToken;
  }
}

export class UpdateAccessTokenRepositorySpy {
  userId = "";
  accessToken = "";

  async update(userId: string, accessToken: string) {
    this.userId = userId;
    this.accessToken = accessToken;
  }
}

class UpdateAccessTokenRepositoryWithError {
  userId = "";
  accessToken = "";

  async update(userId: string, accessToken: string) {
    this.userId = userId;
    this.accessToken = accessToken;
    throw new Error();
  }
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  const encrypterSpy = new EncrypterHelperSpy();
  const tokenGeneratorSpy = new TokenGeneratorSpy();
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypterHelper: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
  });
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy,
  };
};

describe("Auth UseCase", () => {
  test("should call LoadUserByEmailRepository with correct email", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    const email = "any@email.com";
    await sut.auth(email, "any_password");
    expect(loadUserByEmailRepositorySpy.email).toBe(email);
  });
  test("should return null if an invalid email is provided", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;
    const accessToken = await sut.auth("invalid@email.com", "any_password");
    expect(accessToken).toBeNull();
  });
  test("should return null if an invalid password is provided", async () => {
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;
    const accessToken = await sut.auth("invalid@email.com", "invalid_password");
    expect(accessToken).toBeNull();
  });
  test("should call EncrypterHelperSpy with correct values", async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    const password = "any_password";
    await sut.auth("valid@email.com", password);
    expect(encrypterSpy.password).toBe(password);
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepositorySpy.user?.password
    );
  });
  test("should call TokenGenerator with correct userId", async () => {
    const { sut, tokenGeneratorSpy, loadUserByEmailRepositorySpy } = makeSut();
    await sut.auth("valid@email.com", "any_password");
    expect(tokenGeneratorSpy.userId).toBe(
      loadUserByEmailRepositorySpy.user?._id
    );
  });
  test("should call UpdateAccessTokenRepository with correct values", async () => {
    const {
      sut,
      loadUserByEmailRepositorySpy,
      tokenGeneratorSpy,
      updateAccessTokenRepositorySpy,
    } = makeSut();
    await sut.auth("valid@email.com", "any_password");
    expect(updateAccessTokenRepositorySpy.userId).toBe(
      loadUserByEmailRepositorySpy.user?._id
    );
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(
      tokenGeneratorSpy.accessToken
    );
  });
  test("should return an accessToken if correct credentials are provided", async () => {
    const { sut, tokenGeneratorSpy } = makeSut();
    const accessToken = await sut.auth("valid@email.com", "any_password");
    expect(accessToken).toBeTruthy();
    expect(tokenGeneratorSpy.accessToken).toBe(accessToken);
  });
  test("should throw if any dependency throws", async () => {
    const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy();
    const encrypterHelper = new EncrypterHelperSpy();
    const tokenGenerator = new TokenGeneratorSpy();
    const updateAccessTokenRepository = new UpdateAccessTokenRepositorySpy();

    const suts: AuthUseCase[] = [
      new AuthUseCase({
        loadUserByEmailRepository: new LoadUserByEmailRepositoryWithError(),
        encrypterHelper,
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypterHelper: new EncrypterHelperWithError(),
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypterHelper,
        tokenGenerator: new TokenGeneratorWithError(),
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypterHelper,
        tokenGenerator,
        updateAccessTokenRepository: new UpdateAccessTokenRepositoryWithError(),
      }),
    ];

    for (const sut of suts) {
      const promise = sut.auth("any@email.com", "any_password");
      expect(promise).rejects.toThrow();
    }
  });
});
