const koa = require('Koa');
const static = require('koa-static');
const router = require('koa-router');

const server = new koa();
server.listen(8080); 

const r1 = router();
server.use(r1.routes());

r1.get('/reg/:id', async function (ctx, next) {
  console.log(ctx.params)
  console.log(ctx.request.query)
  ctx.response.body='aaa';
})

server.use(static('./www'));