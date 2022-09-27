import { NextFunction, Request, Response } from "express";

export const configCors = (req: Request, res: Response, next: NextFunction) => {
  res.header("access-control-allow-origin", "*");
  res.header("access-control-allow-methods", "*");
  res.header("access-control-allow-headers", "*");
  next();
};
