const koa = require('koa');
const myStatic = require('./libs/my-static');

const server = new koa();

server.listen(8080);

server.use(myStatic('./www'))