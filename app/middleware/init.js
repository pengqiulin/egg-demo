'use strict';
module.exports = () => {
  return async (ctx, next) => {
    ctx.returnBody = ({ code = 200, statusCode = '1000', msg = '', data = {} }) => {
      ctx.status = code;
      ctx.body = { statusCode, msg, data };
      return;
    };
    await next();
  };
};
