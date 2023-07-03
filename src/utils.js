/**
 * 获取请求IP地址
 *
 * 在koa.js中间件中，通过 ctx.ip 可直接获取
 *
 * @param req
 * @returns {string} IP地址
 */
const getClientIP = (req) => {
  // console.log('getClientIP: ', req)

  // 判断是否有反向代理 IP
  const result =
    req.headers["x-forwarded-for"] ?? // 判断是否有反向代理 IP
    req.headers["x-real-ip"] ??
    req.connection.remoteAddress ?? // 判断 connection 的远程 IP
    req.socket.remoteAddress ?? // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress ??
    "";

  // console.log('result: ', result)
  return result;
};

/**
 * 输出程序初始化信息
 */
export const consoleInit = () => {
  console.log(
    "\x1b[32m%s\x1b[0m",
    "\n\n🟡 ============================",
    `\n\n🚀 Launching ${process.env.npm_package_name} v${process.env.npm_package_version}`,
    `\n\n✨ Node.js ${process.version} is started under ${process.env.NODE_ENV}\n`
  );
};

/**
 * 简易日志
 *
 * @param {*} ctx
 * @param {*} next
 */
export const briefLog = async (ctx, next) => {
  const start = Date.now();
  if (ctx.url !== "/favicon.ico") await next();

  // Client IP
  // 可按需开启不同测试信息的输出
  //  console.log('ctx.req(node req): ', ctx.req)
  //  console.log('ctx.request: ', ctx.request)
  ctx.set("APP-Client-IP", getClientIP(ctx.req));

  // Response Time
  const duration = Date.now() - start;
  const durationText = `${duration}ms`;
  ctx.set("X-Response-Time", durationText);

  console.log(
    `${ctx.ip} > ${ctx.method} ${ctx.type} > ${ctx.url} - ${durationText}`
  );
};

/**
 * Handle request method
 *
 * @param {*} ctx
 * @param {*} next
 */
export const methodHandler = async (ctx, next) => {
  if (ctx.method === "OPTIONS") {
    // Quickly response to OPTIONS method
    ctx.status = 204;
  } else if (ctx.method === "POST") {
    // Allow only POST method
    await next();
  } else {
    ctx.status = 405;
  }
};
