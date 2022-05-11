'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const { ctx, app } = this;
    const errors = app.validator.validate(
      {
        username: { type: 'string', required: true, desc: '用户名' },
        password: { type: 'string', required: true, desc: '密码' },
      },
      ctx.request.body
    );
    if (errors && errors.length > 0) {
      ctx.body = errors;
      return;
    }
    const { username, password } = ctx.request.body;
    const userInfo = await ctx.model.User.findOne({
      where: {
        username,
      },
    });
    if (!userInfo || !userInfo.id) {
      ctx.returnBody({
        code: 500,
        msg: '账号不存在',
        data: null,
      });
      return;
    }
    if (userInfo && password !== userInfo.password) {
      ctx.returnBody({
        code: 500,
        msg: '账号密码错误',
        data: null,
      });
      return;
    }
    // token 生成
    const token = app.jwt.sign(
      {
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // token 有效期为 24 小时
      },
      app.config.jwt.secret
    );
    ctx.returnBody({
      code: 200,
      msg: '登录成功',
      data: {
        token,
      },
    });
  }
  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const { username } = await app.jwt.verify(token, app.config.jwt.secret);
    // 通过 token 带过来的 username 获取到个人信息
    const userInfo = await ctx.model.User.findOne({
      where: {
        username,
      },
    });
    if (userInfo) {
      ctx.returnBody({
        code: 200,
        message: '获取成功',
        data: {
          id: userInfo.id,
          username: userInfo.username,
        },
      });
    } else {
      ctx.returnBody({
        code: 500,
        message: '获取失败',
      });
    }
  }
  async getUserById() {
    const { ctx } = this;
    const userInfo = await ctx.model.User.findByPk(ctx.params.id);
    if (userInfo) {
      ctx.returnBody({
        code: 200,
        message: '获取成功',
        data: {
          id: userInfo.id,
          username: userInfo.username,
        },
      });
    } else {
      ctx.returnBody({
        code: 500,
        message: '获取失败',
      });
    }
  }
  async getUserByQuery() {
    const { ctx } = this;
    const userInfo = await ctx.model.User.findByPk(ctx.query.id);
    if (userInfo) {
      ctx.returnBody({
        code: 200,
        message: '获取成功',
        data: {
          id: userInfo.id,
          username: userInfo.username,
        },
      });
    } else {
      ctx.returnBody({
        code: 500,
        message: '获取失败',
      });
    }
  }
  async createUser() {
    const { ctx, app } = this;
    const errors = app.validator.validate(
      {
        username: { type: 'string', required: true, desc: '用户名' },
        password: { type: 'string', required: true, desc: '密码' },
      },
      ctx.request.body
    );
    if (errors && errors.length > 0) {
      ctx.body = errors;
      return;
    }
    const { username, password } = ctx.request.body;
    const userInfo = await ctx.model.User.create({ username, password });
    if (!userInfo) {
      ctx.returnBody({
        code: 500,
        message: '创建失败',
      });
      return;
    }
    ctx.returnBody({
      code: 200,
      message: '创建成功',
    });
  }
  // 批量创建
  async createUserList() {
    const { ctx, app } = this;
    const { data } = ctx.request.body;
    const errors = app.validator.validate(
      {
        data: {
          type: 'array',
          required: true,
          min: 1,
          itemType: 'object',
          rule: {
            username: { type: 'string', required: true }, // 用户名
            password: { type: 'string', required: true }, // 密码
          },
        },
      },
      ctx.request.body
    );
    if (errors && errors.length > 0) {
      ctx.body = errors;
      return;
    }
    const transaction = await ctx.model.transaction();
    try {
      for (let i = 0; i < data.length; i++) {
        const m = data[i];
        if (!m.id) {
          await ctx.model.User.create(m, { transaction });
        } else {
          const UpdateClause = await ctx.model.User.findByPk(m.id, {
            transaction,
          });
          if (UpdateClause) {
            UpdateClause.update(m);
          } else {
            await ctx.model.User.create(m, { transaction });
          }
        }
      }
      await transaction.commit();
      ctx.returnBody({
        code: 200,
        message: '创建成功',
      });
    } catch (error) {
      await transaction.rollback();
      ctx.returnBody({
        code: 500,
        message: '创建失败',
      });
    }
    // const userInfo = await ctx.model.User.bulkCreate(data);
    // if (userInfo) {
    //   ctx.returnBody({
    //     code: 200,
    //     message: '创建成功',
    //   });
    // } else {
    //   ctx.returnBody({
    //     code: 500,
    //     message: '创建失败',
    //   });
    // }
  }
  async getUserList() {
    const { ctx } = this;
    const userInfo = await ctx.model.User.findAll();
    if (userInfo) {
      ctx.returnBody({
        code: 200,
        message: '获取成功',
        data: userInfo,
      });
    } else {
      ctx.returnBody({
        code: 500,
        message: '获取失败',
      });
    }
  }
  async getUserListAndCout() {
    const { ctx } = this;
    const userInfo = await ctx.model.User.findAndCountAll();
    if (userInfo) {
      ctx.returnBody({
        code: 200,
        message: '获取成功',
        data: userInfo,
      });
    } else {
      ctx.returnBody({
        code: 500,
        message: '获取失败',
      });
    }
  }
  async findUserByCondition() {
    const { ctx, app } = this;
    const { username } = ctx.request.body;
    const Op = app.Sequelize.Op;
    const userInfo = await ctx.model.User.findAll({
      where: {
        // id大于3
        id: {
          [Op.gt]: 6,
        },
        // 模糊搜用户名
        username: {
          [Op.like]: `%${username}%`,
        },
      },
    });
    if (userInfo) {
      ctx.returnBody({
        code: 200,
        message: '获取成功',
        data: userInfo,
      });
    } else {
      ctx.returnBody({
        code: 500,
        message: '获取失败',
      });
    }
  }
  async findAllLimtColumn() {
    const { ctx } = this;
    const userInfo = await ctx.model.User.findAll({
      attributes: [ 'id', 'username' ],
    });
    if (userInfo) {
      ctx.returnBody({
        code: 200,
        message: '获取成功',
        data: userInfo,
      });
    } else {
      ctx.returnBody({
        code: 500,
        message: '获取失败',
      });
    }
  }
  // 分页查询
  async findAllByPage() {
    const { ctx } = this;
    const { pageSize = 2, pageNum = 1 } = ctx.request.body;
    const limit = Number(pageSize);
    const offset = Number((pageNum - 1) * limit);
    const userInfo = await ctx.model.User.findAll({ offset, limit });
    const total = await ctx.model.User.count();
    if (userInfo) {
      ctx.returnBody({
        code: 200,
        message: '获取成功',
        data: {
          total,
          list: userInfo,
        },
      });
    } else {
      ctx.returnBody({
        code: 500,
        message: '获取失败',
      });
    }
  }
  // 根据id删除
  async deletOneUser() {
    const { ctx } = this;
    const id = ctx.params.id ? parseInt(ctx.params.id) : 0;
    const userInfo = await ctx.model.User.findByPk(id);
    if (!userInfo) {
      ctx.returnBody({
        code: 200,
        message: '未找到该用户',
      });
    }
    await userInfo.destroy();
    ctx.returnBody({
      code: 200,
      message: '删除成功',
    });
  }
  // 更新信息
  async updateOneUser() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    const userInfo = await ctx.model.User.findOne({
      where: {
        username,
      },
    });
    if (!userInfo) {
      ctx.returnBody({
        code: 200,
        message: '未找到该用户',
      });
    }
    await userInfo.update({ password });
    ctx.returnBody({
      code: 200,
      message: '修改成功',
    });
  }
}

module.exports = UserController;
