const koa = require('koa');
const convert = require('koa-convert');
const body = require('koa-better-body');

const server = new koa();

server.listen(8080);

server.use(convert(body({
  uploadDir:'./upload/'
})));

server.use(async function (ctx, next) {
  console.log(ctx.request.body);
  console.log(ctx.request.files);
  console.log(ctx.request.fields);
})