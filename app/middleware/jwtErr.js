'use strict';
module.exports = () => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization;
    if (!token) {
      ctx.code = 200;
      ctx.body = {
        code: 401,
        statusCode: '1006',
        msg: 'token已过期',
        message: 'token已过期',
      };
      return;
    }
    await next();
  };
};
