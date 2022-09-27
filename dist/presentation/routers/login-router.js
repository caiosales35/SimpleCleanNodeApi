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
exports.LoginRouter = void 0;
const errors_1 = require("../errors");
const http_response_1 = require("../helpers/http-response");
class LoginRouter {
    constructor(authUseCase, emailValidator) {
        this.authUseCase = authUseCase;
        this.emailValidator = emailValidator;
    }
    route(httpRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = httpRequest.body;
            if (!email)
                return http_response_1.HttpResponse.badRequest({
                    message: new errors_1.MissingParamError("email"),
                });
            if (!password)
                return http_response_1.HttpResponse.badRequest({
                    message: new errors_1.MissingParamError("password"),
                });
            try {
                if (!this.emailValidator.isValid(String(email)))
                    return http_response_1.HttpResponse.badRequest({
                        message: new errors_1.InvalidParamError("email"),
                    });
                const accessToken = yield this.authUseCase.auth(String(email), String(password));
                if (!accessToken)
                    return http_response_1.HttpResponse.unauthorizedError();
                return http_response_1.HttpResponse.ok({ accessToken });
            }
            catch (error) {
                // console.error(error)
                return http_response_1.HttpResponse.serverError();
            }
        });
    }
}
exports.LoginRouter = LoginRouter;
