import { Router } from "express";
import { ExpressRouterAdapter } from "../adapters/exprees-router-adapter";
import { LoginRouterComposer } from "../composers/login-router-composer";

export const LoginRouter = (router: Router) => {
  router.post(
    "/login",
    ExpressRouterAdapter.adapt(LoginRouterComposer.compose())
  );
};
