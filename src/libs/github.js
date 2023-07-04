/**
 * GitHub相关
 *
 * 处理授权、用户资料获取等业务
 */
const composeCredentials = (code, appId, appSecret) => ({
  client_id: appId ?? process.env.APP_ID,
  client_secret: appSecret ?? process.env.APP_SECRET,
  code,
});

const catchError = (error) => {
  throw new Error(JSON.stringify(error));
};

const requestAccessToken = async (credentials) => {
  // console.log('requestAccessToken: ', credentials)

  const result = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((res) => res.json())
    .catch(catchError);

  // console.log('result: ', result)
  return result;
};

/**
 * 获取用户数据；凭证为access_token
 */
const requestUserAccount = async (token) => {
  // console.log('requestUserAccount: ', token)

  const result = await fetch(
    `https://api.github.com/user?access_token=${token}`,
    {
      headers: { Authorization: `bearer ${token}` },
    }
  )
    .then((res) => res.json())
    .catch(catchError);

  if (typeof result.message === "string") {
    throw new Error(result.message);
  }

  // console.log('result: ', result)
  return result;
};

/**
 * 获取GitHub用户数据
 *
 * 1. 应用客户端获取code
 *  - Web示例（一并请求获取用户Email的权限）: https://github.com/login/oauth/authorize?client_id=a6e28821c0efcfb69d7d&scope=user:email
 * 2. 应用服务端使用code向GitHub服务端请求access_token
 * 3. 应用服务端使用access_token向GitHub服务端请求用户数据
 */
export const main = async (ctx) => {
  // validate params
  const params = ctx.query;
  // console.log("params: ", params);

  if (process.env.NODE_ENV === "development") {
    if (!params.code) {
      ctx.throw(422, "input 'code' not received");
    }
  } else {
    const requiredParams = ["code", "appId", "appSecret"];
    const missedParams = requiredParams.filter((item) => !params[item]);

    if (missedParams.length > 0) {
      const missedParamsString = missedParams.reduce(
        (prev, now) => `${prev}'${now}', `,
        ""
      );
      ctx.throw(422, `input ${missedParamsString.trimEnd(", ")} not received`);
    }
  }

  const { code, appId, appSecret } = params;
  const credentials = composeCredentials(code, appId, appSecret);

  const { access_token } = await requestAccessToken(credentials);

  const user = await requestUserAccount(access_token);

  ctx.body = {
    data: user,
  };
};

export default main;
