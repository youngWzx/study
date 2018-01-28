const koa = require('Koa');
const static = require('koa-static');

const server = new koa();
server.listen(8080); 

server.use(async function(ctx,next){

});

server.use(static('./www'));