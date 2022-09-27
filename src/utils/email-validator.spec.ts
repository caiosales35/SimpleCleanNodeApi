import validator from "validator";
import { EmailValidator } from "./email-validator";

jest.mock("validator");
const mockedValidator = validator as jest.Mocked<typeof validator>;

const makeSut = () => {
  return new EmailValidator();
};

describe("Email Validator", () => {
  beforeAll(() => {
    mockedValidator.isEmail.mockReturnValue(true);
  });
  test("should return true if validator returns true", () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid("valid@email.com");
    expect(isEmailValid).toBeTruthy();
  });
  test("should return false if validator returns false", () => {
    mockedValidator.isEmail.mockReturnValue(false);
    const sut = makeSut();
    const isEmailValid = sut.isValid("invalid@email.com");
    expect(isEmailValid).not.toBeTruthy();
  });
  test("should call validator with correct email", () => {
    const email = "any@email.com";
    const sut = makeSut();
    sut.isValid(email);
    expect(mockedValidator.isEmail).toHaveBeenCalledWith(email);
  });
});
