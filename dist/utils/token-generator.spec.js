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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock("jsonwebtoken");
const mockedJwt = jsonwebtoken_1.default;
class TokenGenerator {
    constructor(secret) {
        this.secret = "";
        this.secret = secret;
    }
    generate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign(id, this.secret);
        });
    }
}
const any_token = "any_token";
const any_secret = "any_secret";
const makeSut = () => {
    return new TokenGenerator(any_secret);
};
describe("Token generator", () => {
    beforeEach(() => {
        mockedJwt.sign.mockImplementation((value, secret) => {
            return Promise.resolve(any_token);
        });
    });
    test("should return null if JWT returns null", () => __awaiter(void 0, void 0, void 0, function* () {
        mockedJwt.sign.mockResolvedValue(null);
        const sut = makeSut();
        const token = yield sut.generate("any_id");
        expect(token).toBeNull();
    }));
    test("should return a token if JWT returns token", () => __awaiter(void 0, void 0, void 0, function* () {
        const sut = makeSut();
        const token = yield sut.generate("any_id");
        expect(token).toBe(any_token);
    }));
    test("should call JWT with correct values", () => __awaiter(void 0, void 0, void 0, function* () {
        const value = "any_id";
        const sut = makeSut();
        yield sut.generate(value);
        expect(mockedJwt.sign).toBeCalledWith(value, any_secret);
    }));
});
