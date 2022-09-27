import jwt, { Secret } from "jsonwebtoken";

jest.mock("jsonwebtoken");
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

class TokenGenerator {
  secret = "";

  constructor(secret: string) {
    this.secret = secret;
  }

  async generate(id: string) {
    return jwt.sign(id, this.secret);
  }
}

const any_token = "any_token";
const any_secret = "any_secret";

const makeSut = () => {
  return new TokenGenerator(any_secret);
};

describe("Token generator", () => {
  beforeEach(() => {
    mockedJwt.sign.mockImplementation(
      (value: string | object | Buffer, secret: Secret) => {
        return Promise.resolve(any_token);
      }
    );
  });
  test("should return null if JWT returns null", async () => {
    mockedJwt.sign.mockResolvedValue(null as never);
    const sut = makeSut();
    const token = await sut.generate("any_id");
    expect(token).toBeNull();
  });
  test("should return a token if JWT returns token", async () => {
    const sut = makeSut();
    const token = await sut.generate("any_id");
    expect(token).toBe(any_token);
  });
  test("should call JWT with correct values", async () => {
    const value = "any_id";
    const sut = makeSut();
    await sut.generate(value);
    expect(mockedJwt.sign).toBeCalledWith(value, any_secret);
  });
});
