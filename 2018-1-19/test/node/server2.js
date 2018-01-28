const koa = require('koa');
const route = require('koa-route');
const static = require('koa-static');

const server = new koa();
server.listen(8080); 

server.use(route.get('/reg', async function (ctx, a, b,next) {
  console.log(a,b)
  console.log(ctx.request.query);
}));

server.use(static('./www'));