'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const moment = require('moment');
// 故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
// 管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');
class UploadController extends Controller {
  // 测试上传
  async testUpload() {
    const { ctx } = this;
    const { files } = ctx.request;
    const results = [];
    files.forEach(file => {
      const f = fs.readFileSync(file.filepath);
      const time = moment().format('YYYYMMDDHHmm');
      const _path = path.join(
        path.resolve(__dirname, '..'),
        `public/upload/${time}${file.filename}`
      );
      // 将文件存到指定位置
      fs.writeFileSync(_path, f);
      results.push(file.filename);
    });
    ctx.body = { code: 200, message: '上传成功', data: results.join(',') };
  }
  // 测试文件流上传
  async testUploadStream() {
    const { ctx } = this;
    const stream = await ctx.getFileStream(); // 获取文件流
    const filename =
      Math.random().toString(36).substr(2) +
      new Date().getTime() +
      path.extname(stream.filename).toLocaleLowerCase();
    const _path = path.join(
      path.resolve(__dirname, '..'),
      `public/upload/${filename}`
    );
    const writeStream = fs.createWriteStream(_path);
    try {
      // 异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      // 如果出现错误，则关闭管道
      await sendToWormhole(stream);
      ctx.status = 500;
      ctx.body = {
        msg: '未知错误！',
      };
      throw err;
    }
    ctx.body = { code: 200, message: '上传成功' };
  }
}

module.exports = UploadController;
