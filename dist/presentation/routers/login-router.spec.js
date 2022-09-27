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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailValidatorSpy = exports.AuthUseCaseSpy = void 0;
const errors_1 = require("../errors");
const login_router_1 = require("./login-router");
class AuthUseCaseSpy {
    constructor() {
        this.email = "";
        this.password = "";
        this.accessToken = "valid_token";
    }
    auth(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            this.email = email;
            this.password = password;
            return this.accessToken;
        });
    }
}
exports.AuthUseCaseSpy = AuthUseCaseSpy;
class EmailValidatorSpy {
    constructor() {
        this.isEmailValid = true;
        this.email = "";
    }
    isValid(email) {
        this.email = email;
        return this.isEmailValid;
    }
}
exports.EmailValidatorSpy = EmailValidatorSpy;
const makeSut = () => {
    const authUseCaseSpy = new AuthUseCaseSpy();
    const emailValidatorSpy = new EmailValidatorSpy();
    const sut = new login_router_1.LoginRouter(authUseCaseSpy, emailValidatorSpy);
    return {
        sut,
        authUseCaseSpy,
        emailValidatorSpy,
    };
};
const makeAuthUseCaseWithError = () => {
    class AuthUseCaseSpy {
        constructor() {
            this.email = "";
            this.password = "";
            this.accessToken = "valid_token";
        }
        auth(email, password) {
            return __awaiter(this, void 0, void 0, function* () {
                throw new Error();
                return email + password;
            });
        }
    }
    return new AuthUseCaseSpy();
};
const makeEmailValidatorWithError = () => {
    class EmailValidatorSpy {
        constructor() {
            this.isEmailValid = true;
            this.email = "";
        }
        isValid(email) {
            this.email = email;
            throw new Error();
            return this.isEmailValid;
        }
    }
    return new EmailValidatorSpy();
};
describe("Login router", () => {
    test("should return 400 if no email is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                password: "any_password",
            },
        };
        const httpResponse = yield sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toEqual(new errors_1.MissingParamError("email"));
    }));
    test("should return 400 if invalid email is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, emailValidatorSpy } = makeSut();
        emailValidatorSpy.isEmailValid = false;
        const httpRequest = {
            body: {
                email: "invalid@email.com",
                password: "valid_password",
            },
        };
        const httpResponse = yield sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toEqual(new errors_1.InvalidParamError("email"));
    }));
    test("should return 400 if no password is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: "any@email.com",
            },
        };
        const httpResponse = yield sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toEqual(new errors_1.MissingParamError("password"));
    }));
    test("should call AuthUseCase with correct params", () => __awaiter(void 0, void 0, void 0, function* () {
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
    }));
    test("should call EmailValidator with correct email", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, emailValidatorSpy } = makeSut();
        const httpRequest = {
            body: {
                email: "any@email.com",
                password: "any_password",
            },
        };
        sut.route(httpRequest);
        expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
    }));
    test("should return 401 when invalid credentials are provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, authUseCaseSpy } = makeSut();
        authUseCaseSpy.accessToken = "";
        const httpRequest = {
            body: {
                email: "invalid@email.com",
                password: "invalid_password",
            },
        };
        const httpResponse = yield sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body.message).toEqual(new errors_1.UnauthorizedError());
    }));
    test("should return 200 when valid credentials are provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, authUseCaseSpy } = makeSut();
        const httpRequest = {
            body: {
                email: "valid@email.com",
                password: "valid_password",
            },
        };
        const httpResponse = yield sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
    }));
    test("should return 500 if AuthUseCase throws", () => __awaiter(void 0, void 0, void 0, function* () {
        const authUseCaseSpy = makeAuthUseCaseWithError();
        const emailValidatorSpy = new EmailValidatorSpy();
        const sut = new login_router_1.LoginRouter(authUseCaseSpy, emailValidatorSpy);
        const httpRequest = {
            body: {
                email: "valid@email.com",
                password: "valid_password",
            },
        };
        const httpResponse = yield sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.message).toEqual(new errors_1.ServerError());
    }));
    test("should return 500 if EmailValidator throws", () => __awaiter(void 0, void 0, void 0, function* () {
        const emailValidatorSpy = makeEmailValidatorWithError();
        const authUseCaseSpy = new AuthUseCaseSpy();
        const sut = new login_router_1.LoginRouter(authUseCaseSpy, emailValidatorSpy);
        const httpRequest = {
            body: {
                email: "valid@email.com",
                password: "valid_password",
            },
        };
        const httpResponse = yield sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.message).toEqual(new errors_1.ServerError());
    }));
});
