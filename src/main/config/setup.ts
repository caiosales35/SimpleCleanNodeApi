import { Express, json, urlencoded } from "express";
import { configContentType } from "../middlewares/content-type";
import { configCors } from "../middlewares/cors";

export const configServer = (app: Express) => {
  app.disable("x-powered-by");
  app.use(configCors);
  app.use(configContentType);
  app.use(json());
  app.use(urlencoded({ extended: true }));
};
