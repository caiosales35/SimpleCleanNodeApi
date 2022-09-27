import { MongoHelper } from "../helpers/mongo-helper";

export class LoadUserByEmailRepository {
  async load(email: string) {
    const db = new MongoHelper();
    await db.connect(String(process.env.MONGO_URL));
    const user = await (await db.getDb())
      .collection("users")
      .findOne({ email });
    return user;
  }
}
