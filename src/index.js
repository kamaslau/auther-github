import Koa from "koa";
import cors from "@koa/cors";
import * as dotenv from "dotenv";
import { errorCatcher, consoleInit, briefLog, methodHandler } from "./utils.js";
import doAuth from "./libs/authGithub.js";

dotenv.config();
globalThis.isDev = process.env.NODE_ENV !== "production";

consoleInit();

const app = new Koa();

app.on("error", errorCatcher);

app.use(briefLog);

app.use(cors({ origin: "*", allowMethods: "POST" }));

app.use(methodHandler);

app.use(doAuth);

app.listen(3000);
