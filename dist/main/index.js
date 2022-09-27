"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_helper_1 = require("../infra/helpers/mongo-helper");
const app_1 = __importDefault(require("./config/app"));
//import { env } from "./config/env";
const db = new mongo_helper_1.MongoHelper();
app_1.default.listen(3000, () => console.log("Server is running on port 3000"));
/*
db.connect(env.mongoUrl)
  .then(() =>
    app.listen(3000, () => console.log("Server is running on port 3000"))
  )
  .catch(console.error);
  */
