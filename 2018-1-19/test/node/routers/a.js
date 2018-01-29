const router = require('koa-router');

const r1 = router();

r1.get('/a',async (ctx, next)=>{
  ctx.response.body='aaaa';
})

r1.get('/b',async (ctx, next)=>{
  ctx.response.body='bbbb';
})

module.exports = r1.routes();