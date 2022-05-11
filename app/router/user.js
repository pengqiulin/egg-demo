'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { controller, router, middleware } = app;
  router.post('/login', controller.user.login);
  router.post('/register', controller.user.createUser);
  router.post('/createUserList', middleware.jwtErr(), controller.user.createUserList);
  router.get('/userInfo', middleware.jwtErr(), controller.user.getUserInfo);
  router.get('/userById/:id', middleware.jwtErr(), controller.user.getUserById);
  router.get('/user', middleware.jwtErr(), controller.user.getUserByQuery);
  router.get('/getUserList', middleware.jwtErr(), controller.user.getUserList);
  router.get('/getUserListAndCout', middleware.jwtErr(), controller.user.getUserListAndCout);
  router.post('/findUserByCondition', middleware.jwtErr(), controller.user.findUserByCondition);
  router.post('/findAllByPage', middleware.jwtErr(), controller.user.findAllByPage);
  router.get('/findAllLimtColumn', middleware.jwtErr(), controller.user.findAllLimtColumn);
  router.get('/deletOneUser/:id', middleware.jwtErr(), controller.user.deletOneUser);
  router.post('/updateOneUser', middleware.jwtErr(), controller.user.updateOneUser);
};
