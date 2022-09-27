import express from "express";
import { setupRoutes } from "./routes";
import { configServer } from "./setup";

const app = express();
configServer(app);
setupRoutes(app);

export default app;
