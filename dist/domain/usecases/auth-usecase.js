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
exports.AuthUseCase = void 0;
class AuthUseCase {
    constructor({ loadUserByEmailRepository, encrypterHelper, tokenGenerator, updateAccessTokenRepository, }) {
        this.loadUserByEmailRepository = loadUserByEmailRepository;
        this.encrypterHelper = encrypterHelper;
        this.tokenGenerator = tokenGenerator;
        this.updateAccessTokenRepository = updateAccessTokenRepository;
    }
    auth(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.loadUserByEmailRepository.load(email);
            const isValid = user && (yield this.encrypterHelper.compare(password, user.password));
            if (isValid) {
                const accessToken = yield this.tokenGenerator.generate(user.id);
                yield this.updateAccessTokenRepository.update(user.id, accessToken);
                return accessToken;
            }
            return null;
        });
    }
}
exports.AuthUseCase = AuthUseCase;
