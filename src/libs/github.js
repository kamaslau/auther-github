/**
 * GitHub相关
 *
 * https://docs.github.com/
 * https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/
 * https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
 * https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
 *
 * 处理授权、用户资料获取等业务
 */
const composeCredentials = (code) => ({
  client_id: process.env.GH_ID,
  client_secret: process.env.GH_SECRET,
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
  const { code } = ctx.query;

  if (!code) {
    ctx.body = { errorMessage: "input 'code' not received" };
    ctx.status = 422;
    return;
  }

  const credentials = composeCredentials(code);

  const { access_token } = await requestAccessToken(credentials);

  const user = await requestUserAccount(access_token);

  ctx.body = {
    data: user,
  };
};

export default main;
