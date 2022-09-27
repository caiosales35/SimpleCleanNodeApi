import { Request, Response } from "express";
import request from "supertest";
import app from "../config/app";

describe("Content-type middleware", () => {
  test("should return json content-type as default", async () => {
    app.get("/", (req: Request, res: Response) => {
      res.send("");
    });
    await request(app).get("/").expect("content-type", /json/);
  });
  test("should return xml content-type if forced", async () => {
    app.get("/xml", (req: Request, res: Response) => {
      res.type("xml");
      res.send("");
    });
    await request(app).get("/xml").expect("content-type", /xml/);
  });
});
