export const authGithub = async (ctx) => {
  const { code } = ctx.query;
  console.log("code: ", code);

  ctx.body = { code };
};
