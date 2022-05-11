'use strict';
// 异常处理、参数校验监听拦截中间件
module.exports = () => {
  return async function errrorHanlder(ctx, next) {
    try {
      await next();
    } catch (error) {
      // 记录日志用
      ctx.app.emit('error', error, ctx);
      // 统一异常返回
      ctx.status = error.status;
      if (error.code === 'invalid_param') {
        const msg =
          error.errors &&
          error.errors.length > 0 &&
          error.errors.map(item => item.err[0]).join(';');
        ctx.returnBody({
          code: 200,
          statusCode: '1001',
          msg,
        });
        return;
      }
      // 统一异常返回
      ctx.status = error.status;
      ctx.body = {
        statusCode: '1004',
        msg: error.message,
      };
    }
  };
};
