import { Db } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { LoadUserByEmailRepository } from "./load-user-repository";

let mongoHelper: MongoHelper;
let db: Db;

const makeSut = () => {
  const sut = new LoadUserByEmailRepository();
  return { sut };
};

describe("LoadUserByEmail Repository", () => {
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
  test("should return null if no user is found", async () => {
    const { sut } = makeSut();
    const user = await sut.load("invalid@email.com");
    expect(user).toBeNull();
  });
  test("should return an user if user is found", async () => {
    const { sut } = makeSut();
    const email = "valid@email.com";
    await db.collection("users").insertOne({ email });
    const user = await sut.load(email);
    expect(user).toBeTruthy();
    expect(user?.email).toBe(email);
  });
});
