import {
  HttpResponseType,
  LoginRouter as LoginRoute,
} from "@/presentation/routers/login-router";
import { Request, Response } from "express";

export class ExpressRouterAdapter {
  static adapt(router: LoginRoute) {
    return async (req: Request, res: Response) => {
      const httpRequest = { body: req.body };
      const httpResposponse: HttpResponseType = await router.route(httpRequest);
      res.status(httpResposponse.statusCode).json(httpResposponse.body);
    };
  }
}
