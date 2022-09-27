import { ObjectId } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";

export class UpdateAccessTokenRepository {
  async update(userId: ObjectId, accessToken: string) {
    const db = new MongoHelper();
    await db.connect(String(process.env.MONGO_URL));

    await (await db.getDb())
      .collection("users")
      .updateOne({ _id: userId }, { $set: { accessToken } });
  }
}
