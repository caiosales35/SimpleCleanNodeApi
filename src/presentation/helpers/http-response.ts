import { ServerError, UnauthorizedError } from "../errors";
import { HttpResponseType } from "../routers/login-router";

export class HttpResponse {
  static badRequest(data?: Record<string, unknown>): HttpResponseType {
    return { statusCode: 400, body: data || {} };
  }
  static unauthorizedError(): HttpResponseType {
    return { statusCode: 401, body: { message: new UnauthorizedError() } };
  }
  static serverError(): HttpResponseType {
    return { statusCode: 500, body: { message: new ServerError() } };
  }
  static ok(data?: Record<string, unknown>): HttpResponseType {
    return { statusCode: 200, body: data || {} };
  }
}
