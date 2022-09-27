"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const email_validator_1 = require("./email-validator");
jest.mock("validator");
const mockedValidator = validator_1.default;
const makeSut = () => {
    return new email_validator_1.EmailValidator();
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
