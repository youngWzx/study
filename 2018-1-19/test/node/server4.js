const koa = require('koa');
const router = require('koa-router');
const static = require('koa-static');

const server = new koa();

server.listen(8080);

const mainRouter = router();

server.use(mainRouter.routes());

mainRouter.use('/user', require('./routers/a'));

server.use(static('./www'));
