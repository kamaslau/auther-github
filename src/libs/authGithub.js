export const main = async (ctx) => {
  const { code } = ctx.query;

  if (!code) {
    ctx.body = { errorMessage: "input 'code' not received" };
    ctx.status = 422;
    return;
  }

  ctx.body = {
    code,
    gitHubId:
      process.env.NODE_ENV === "development" ? process.env.GH_ID : "hidden",
  };
};

export default main;
