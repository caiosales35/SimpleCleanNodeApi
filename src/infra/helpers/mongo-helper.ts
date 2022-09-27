import { MongoClient } from "mongodb";

export class MongoHelper {
  client: any;
  db: any;
  uri = "";
  dbName? = "";

  async connect(uri: string, dbName?: string) {
    this.uri = uri;
    this.dbName = dbName;
    this.client = await MongoClient.connect(uri);
    this.db = this.client.db(dbName);
  }

  async disconnect() {
    await this.client.close();
    this.client = null;
    this.db = null;
  }

  async getDb() {
    if (!this.client?.isConnected) {
      await this.connect(this.uri, this.dbName);
    }
    return this.db;
  }
}
