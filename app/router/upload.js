'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { controller, router, middleware } = app;
  router.post('/upload', middleware.jwtErr(), controller.upload.testUpload);
  router.post('/uploadByStream', middleware.jwtErr(), controller.upload.testUploadStream);
};
