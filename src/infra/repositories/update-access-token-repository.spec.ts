import { Db } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { UpdateAccessTokenRepository } from "./update-access-token-repository";

let mongoHelper: MongoHelper;
let db: Db;

const makeSut = () => {
  const sut = new UpdateAccessTokenRepository();
  return { sut };
};

describe("UpdateAccessTokenRepository", () => {
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
  test("should update the user with the given accessToken", async () => {
    const { sut } = makeSut();
    const email = "valid@email.com";
    const fakeUser = await db.collection("users").insertOne({ email });
    const fakeUserId = fakeUser.insertedId;
    const validToken = "valid_token";
    await sut.update(fakeUserId, validToken);
    const updatedFakeUser = await db
      .collection("users")
      .findOne({ _id: fakeUserId });
    expect(updatedFakeUser?.accessToken).toBe(validToken);
  });
});
