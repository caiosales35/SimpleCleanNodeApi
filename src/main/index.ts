import { MongoHelper } from "../infra/helpers/mongo-helper";
import app from "./config/app";
import { env } from "./config/env";

const db = new MongoHelper();

app.listen(env.port, () =>
  console.log(`Server is running on port ${env.port}`)
);

/*
db.connect(env.mongoUrl)
  .then(() =>
    app.listen(3000, () => console.log("Server is running on port 3000"))
  )
  .catch(console.error);
*/
