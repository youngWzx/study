const koa = require('koa');

const server = new koa();

server.listen(8080);
server.keys = ['wqdqwederter','21dwef5t43', 'qwed1r5twqd'];
server.use(async function(ctx, next){
  ctx.cookies.set('user', '123456', {signed:true});
  console.log(ctx.cookies.get('user'))
  console.log(ctx.cookies.get('user',{signed:true}))
})
