import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import router from "./router";
import { db } from "./service/db";
import shutdown from "./helper/shutdown";

configDotenv();

await db.connect();

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

const server = app.listen(Number(process.env.port), process.env.host!, () => {
  console.log(`http://${process.env.host}:${process.env.port}`);
});

export default server;

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
