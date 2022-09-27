"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponse = void 0;
const errors_1 = require("../errors");
class HttpResponse {
    static badRequest(data) {
        return { statusCode: 400, body: data || {} };
    }
    static unauthorizedError() {
        return { statusCode: 401, body: { message: new errors_1.UnauthorizedError() } };
    }
    static serverError() {
        return { statusCode: 500, body: { message: new errors_1.ServerError() } };
    }
    static ok(data) {
        return { statusCode: 200, body: data || {} };
    }
}
exports.HttpResponse = HttpResponse;
