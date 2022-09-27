import { Request, Response } from "express";
import request from "supertest";
import app from "./app";

describe("App setup", () => {
  test("should disable x-powered-by header", async () => {
    app.get("/", (req: Request, res: Response) => {
      res.send("");
    });
    const response = await request(app).get("/");
    expect(response.header["x-powered-by"]).toBeUndefined();
  });
  test("should parse json", async () => {
    app.post("/", (req: Request, res: Response) => {
      res.send(req.body);
    });
    const response = await request(app).post("/").send({ name: "John" });
    expect(response.body).toEqual({ name: "John" });
  });
});
