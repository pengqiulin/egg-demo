'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUserByName(username) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { username });
      return result;
    } catch (error) {
      return null;
    }
  }
  async getUserById(id) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { id });
      return result;
    } catch (error) {
      return null;
    }
  }
}
module.exports = UserService;
