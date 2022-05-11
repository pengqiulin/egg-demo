/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ], // 配置白名单
  };

  config.cors = {
    // origin: '*', //允许所有跨域访问，注释掉则允许上面 白名单 访问
    credentials: true, // 允许 Cookie 跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'peng123..',
      database: 'data', // 数据库名称
      multipleStatements: true,
    },
    app: true,
    agent: false,
  };
  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'data',
    username: 'root',
    password: 'peng123..',
    timezone: '+08:00', // 保存为本地时区
    define: {
      freezeTableName: true, // 禁止转换为复数
      timestamps: false,
      paranoid: false,
    },
  };
  // 权限
  config.jwt = {
    secret: 'jwt',
  };
  // 参数校验
  config.validate = {
    convert: false,
    // validateRoot: false,
  };
  // 错误配置
  config.onerror = {
    accepts: () => 'json',
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1651887254585_214';

  // add your middleware config here
  config.middleware = [ 'errorHanlder', 'init' ];
  config.errorHandler = {
    // 通用配置（以下是重点）
    enable: true, // 控制中间件是否开启。
  };
  config.multipart = {
    mode: 'stream', // 对应文件类型
    fileSize: '5000kb',
    fileExtensions: [
      '.txt',
    ],
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
