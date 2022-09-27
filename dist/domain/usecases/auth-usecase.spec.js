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
exports.UpdateAccessTokenRepositorySpy = exports.TokenGeneratorSpy = exports.EncrypterHelperSpy = exports.LoadUserByEmailRepositorySpy = void 0;
const auth_usecase_1 = require("./auth-usecase");
class LoadUserByEmailRepositorySpy {
    constructor() {
        this.email = "";
        this.user = {
            password: "hashed_password",
            id: "any_id",
        };
    }
    load(email) {
        return __awaiter(this, void 0, void 0, function* () {
            this.email = email;
            return this.user;
        });
    }
}
exports.LoadUserByEmailRepositorySpy = LoadUserByEmailRepositorySpy;
class LoadUserByEmailRepositoryWithError {
    constructor() {
        this.email = "";
        this.user = {
            password: "hashed_password",
            id: "any_id",
        };
    }
    load(email) {
        return __awaiter(this, void 0, void 0, function* () {
            this.email = email;
            throw new Error();
            return this.user;
        });
    }
}
class EncrypterHelperSpy {
    constructor() {
        this.password = "";
        this.hashedPassword = "";
        this.isValid = true;
    }
    compare(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            this.password = password;
            this.hashedPassword = hashedPassword;
            return this.isValid;
        });
    }
}
exports.EncrypterHelperSpy = EncrypterHelperSpy;
class EncrypterHelperWithError {
    constructor() {
        this.password = "";
        this.hashedPassword = "";
        this.isValid = true;
    }
    compare(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            this.password = password;
            this.hashedPassword = hashedPassword;
            throw new Error();
            return this.isValid;
        });
    }
}
class TokenGeneratorSpy {
    constructor() {
        this.userId = "";
        this.accessToken = "any_token";
    }
    generate(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.userId = userId;
            return this.accessToken;
        });
    }
}
exports.TokenGeneratorSpy = TokenGeneratorSpy;
class TokenGeneratorWithError {
    constructor() {
        this.userId = "";
        this.accessToken = "any_token";
    }
    generate(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.userId = userId;
            throw new Error();
            return this.accessToken;
        });
    }
}
class UpdateAccessTokenRepositorySpy {
    constructor() {
        this.userId = "";
        this.accessToken = "";
    }
    update(userId, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            this.userId = userId;
            this.accessToken = accessToken;
        });
    }
}
exports.UpdateAccessTokenRepositorySpy = UpdateAccessTokenRepositorySpy;
class UpdateAccessTokenRepositoryWithError {
    constructor() {
        this.userId = "";
        this.accessToken = "";
    }
    update(userId, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            this.userId = userId;
            this.accessToken = accessToken;
            throw new Error();
        });
    }
}
const makeSut = () => {
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
    const encrypterSpy = new EncrypterHelperSpy();
    const tokenGeneratorSpy = new TokenGeneratorSpy();
    const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();
    const sut = new auth_usecase_1.AuthUseCase({
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
    test("should call LoadUserByEmailRepository with correct email", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, loadUserByEmailRepositorySpy } = makeSut();
        const email = "any@email.com";
        yield sut.auth(email, "any_password");
        expect(loadUserByEmailRepositorySpy.email).toBe(email);
    }));
    test("should return null if an invalid email is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, loadUserByEmailRepositorySpy } = makeSut();
        loadUserByEmailRepositorySpy.user = null;
        const accessToken = yield sut.auth("invalid@email.com", "any_password");
        expect(accessToken).toBeNull();
    }));
    test("should return null if an invalid password is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, encrypterSpy } = makeSut();
        encrypterSpy.isValid = false;
        const accessToken = yield sut.auth("invalid@email.com", "invalid_password");
        expect(accessToken).toBeNull();
    }));
    test("should call EncrypterHelperSpy with correct values", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
        const password = "any_password";
        yield sut.auth("valid@email.com", password);
        expect(encrypterSpy.password).toBe(password);
        expect(encrypterSpy.hashedPassword).toBe((_a = loadUserByEmailRepositorySpy.user) === null || _a === void 0 ? void 0 : _a.password);
    }));
    test("should call TokenGenerator with correct userId", () => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { sut, tokenGeneratorSpy, loadUserByEmailRepositorySpy } = makeSut();
        yield sut.auth("valid@email.com", "any_password");
        expect(tokenGeneratorSpy.userId).toBe((_b = loadUserByEmailRepositorySpy.user) === null || _b === void 0 ? void 0 : _b.id);
    }));
    test("should call UpdateAccessTokenRepository with correct values", () => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy, updateAccessTokenRepositorySpy, } = makeSut();
        yield sut.auth("valid@email.com", "any_password");
        expect(updateAccessTokenRepositorySpy.userId).toBe((_c = loadUserByEmailRepositorySpy.user) === null || _c === void 0 ? void 0 : _c.id);
        expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken);
    }));
    test("should return an accessToken if correct credentials are provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut, tokenGeneratorSpy } = makeSut();
        const accessToken = yield sut.auth("valid@email.com", "any_password");
        expect(accessToken).toBeTruthy();
        expect(tokenGeneratorSpy.accessToken).toBe(accessToken);
    }));
    test("should throw if any dependency throws", () => __awaiter(void 0, void 0, void 0, function* () {
        const loadUserByEmailRepository = new LoadUserByEmailRepositorySpy();
        const encrypterHelper = new EncrypterHelperSpy();
        const tokenGenerator = new TokenGeneratorSpy();
        const updateAccessTokenRepository = new UpdateAccessTokenRepositorySpy();
        const suts = [
            new auth_usecase_1.AuthUseCase({
                loadUserByEmailRepository: new LoadUserByEmailRepositoryWithError(),
                encrypterHelper,
                tokenGenerator,
                updateAccessTokenRepository,
            }),
            new auth_usecase_1.AuthUseCase({
                loadUserByEmailRepository,
                encrypterHelper: new EncrypterHelperWithError(),
                tokenGenerator,
                updateAccessTokenRepository,
            }),
            new auth_usecase_1.AuthUseCase({
                loadUserByEmailRepository,
                encrypterHelper,
                tokenGenerator: new TokenGeneratorWithError(),
                updateAccessTokenRepository,
            }),
            new auth_usecase_1.AuthUseCase({
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
    }));
});
