import { MongoHelper } from "./mongo-helper";

describe("Mongo Helper", () => {
  test("Should reconnect when getDb is invoked and client is disconnected", async () => {
    const sut = new MongoHelper();
    await sut.connect(String(process.env.MONGO_URL));
    expect(sut.db).toBeTruthy();
    await sut.disconnect();
    expect(sut.db).toBeFalsy();
    await sut.getDb();
    expect(sut.db).toBeTruthy();
    await sut.disconnect();
  });
});
