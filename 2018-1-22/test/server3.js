const koa = require('koa');
const session = require('koa-session');

const server = new koa();

server.listen(8080);

server.keys=['qwd143r243ge','qwd34t43gewf','t313dfwqft'];

server.use(session(
  {},
  server,
))

server.use(async function (ctx, next) {
  console.log('connect')
  if (!ctx.session['n']) {
    ctx.session['n'] = 1;
  } else {
    ctx.session['n']++;
  }

  console.log(ctx.session['n']);

  ctx.response.body = `这是${ctx.session['n']}`;
})