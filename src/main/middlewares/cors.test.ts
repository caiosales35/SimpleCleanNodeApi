import { Request, Response } from "express";
import request from "supertest";
import app from "../config/app";

describe("Cors middleware", () => {
  test("should enable cors", async () => {
    app.get("/", (req: Request, res: Response) => {
      res.send("");
    });
    const response = await request(app).get("/");
    expect(response.header["access-control-allow-origin"]).toBe("*");
    expect(response.header["access-control-allow-methods"]).toBe("*");
    expect(response.header["access-control-allow-headers"]).toBe("*");
  });
});
