import { MongoHelper } from "@/infra/helpers/mongo-helper";
import bcrypt from "bcrypt";
import { Db } from "mongodb";
import request from "supertest";
import app from "../config/app";

let mongoHelper: MongoHelper;
let db: Db;

describe("Login routes", () => {
  beforeAll(async () => {
    mongoHelper = new MongoHelper();
    await mongoHelper.connect(String(process.env.MONGO_URL));
    db = await mongoHelper.getDb();
  });
  beforeEach(async () => {
    await db.collection("users").deleteMany({});
  });
  afterAll(async () => {
    await mongoHelper.disconnect();
  });
  test("Should return 200 on valid credentials", async () => {
    const fakeUser = {
      email: "valid@gmail.com",
      password: bcrypt.hashSync("validPassword", 10),
    };
    await db.collection("users").insertOne(fakeUser);

    const response = await request(app).post("/api/login").send({
      email: fakeUser.email,
      password: "validPassword",
    });
    expect(response.status).toBe(200);
  });
});
