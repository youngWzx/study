const myKoa = require('my-koa');

const server = new myKoa();

server.listen(8080);

server.use(async function (ctx, next) {
  console.log('a');
  next();
  console.log('c')
})

server.use(function (ctx, next) {
  console.log('b')
})