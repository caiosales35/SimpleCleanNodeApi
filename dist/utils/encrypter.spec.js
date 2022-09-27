"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const encrypter_1 = require("./encrypter");
jest.mock("bcrypt");
const mockedBcrypt = bcrypt_1.default;
const makeSut = () => {
    return new encrypter_1.Encrypter();
};
describe("Encrypter", () => {
    beforeAll(() => {
        mockedBcrypt.compare.mockResolvedValue(true);
    });
    test("should return true if bcrypt returns true", () => __awaiter(void 0, void 0, void 0, function* () {
        const sut = makeSut();
        const isValid = yield sut.compare("any_password", "hashed_password");
        expect(isValid).toBeTruthy();
    }));
    test("should return false if bcrypt returns false", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedBcrypt.compare.mockResolvedValue(false);
        const sut = makeSut();
        const isValid = yield sut.compare("any_password", "hashed_password");
        expect(isValid).not.toBeTruthy();
    }));
    test("should call bcrypt with correct values", () => __awaiter(void 0, void 0, void 0, function* () {
        const value = "any_value";
        const hash = "hashed_value";
        const sut = makeSut();
        yield sut.compare(value, hash);
        expect(bcrypt_1.default.compare).toHaveBeenCalledWith(value, hash);
    }));
});
