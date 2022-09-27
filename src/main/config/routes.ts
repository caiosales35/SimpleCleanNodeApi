import { Express, Router } from "express";
import * as serverRoutes from "../routes/index";

export const setupRoutes = (app: Express) => {
  const router = Router();
  app.use("/api", router);
  serverRoutes.LoginRouter(router);
};
