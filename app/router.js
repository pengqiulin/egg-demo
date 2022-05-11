'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { controller, router } = app;
  router.get('/', controller.home.index);
  require('./router/user')(app);
  require('./router/upload')(app);
};
