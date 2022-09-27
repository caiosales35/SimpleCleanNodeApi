import bcrypt from "bcrypt";
import { Encrypter } from "./encrypter";

jest.mock("bcrypt");
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

const makeSut = () => {
  return new Encrypter();
};

describe("Encrypter", () => {
  beforeAll(() => {
    mockedBcrypt.compare.mockResolvedValue(true as never);
  });
  test("should return true if bcrypt returns true", async () => {
    const sut = makeSut();
    const isValid = await sut.compare("any_password", "hashed_password");
    expect(isValid).toBeTruthy();
  });
  test("should return false if bcrypt returns false", async () => {
    mockedBcrypt.compare.mockResolvedValue(false as never);
    const sut = makeSut();
    const isValid = await sut.compare("any_password", "hashed_password");
    expect(isValid).not.toBeTruthy();
  });
  test("should call bcrypt with correct values", async () => {
    const value = "any_value";
    const hash = "hashed_value";
    const sut = makeSut();
    await sut.compare(value, hash);
    expect(bcrypt.compare).toHaveBeenCalledWith(value, hash);
  });
});
