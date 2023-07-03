import Koa from "koa";
import cors from "@koa/cors";
import { consoleInit, briefLog } from "./utils/briefLog.js";
import { authGithub } from "./libs/authGithub.js";

globalThis.isDev = process.env.NODE_ENV !== "production";

consoleInit();

const app = new Koa();

app.use(briefLog);

app.use(cors({ origin: "*", allowMethods: "POST" }));

app.use(async (ctx, next) => {
  if (ctx.method === "OPTIONS") {
    // Quickly response to OPTIONS method
    ctx.status = 204;
  } else if (ctx.method === "POST") {
    // Allow only POST method
    await next();
  } else {
    ctx.status = 405;
  }
});

app.use(authGithub);

app.listen(3000);
