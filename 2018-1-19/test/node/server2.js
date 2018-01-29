const koa = require('koa');
const route = require('koa-route');
const static = require('koa-static');

const server = new koa();
server.listen(8080); 

server.use(route.get('/reg/:id', async function (ctx,id,next) {
  console.log(ctx.req.pathname, ctx.req.path)
  console.log(id);
  console.log(ctx.request.query);
}));

server.use(static('./www'));