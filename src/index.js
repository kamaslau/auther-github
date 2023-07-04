import Koa from "koa";
import cors from "@koa/cors";
import * as dotenv from "dotenv";
import { errorCatcher, consoleInit, briefLog, methodHandler } from "./utils.js";
import doAuth from "./libs/authGithub.js";

dotenv.config();

consoleInit();

process.env.NODE_ENV === "development" &&
  console.log(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GH_ID}&redirect_uri=http://localhost:${process.env.PORT}&scope=user:email`
  );

const app = new Koa();

app.on("error", errorCatcher);

app.use(briefLog);

app.use(cors({ origin: "*", allowMethods: "POST" }));

app.use(methodHandler);

app.use(doAuth);

app.listen(process.env.PORT);
