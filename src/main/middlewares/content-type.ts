import { NextFunction, Request, Response } from "express";

export const configContentType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header("content-type", "application/json");
  next();
};
