const koa = require('koa');
const mysql = require('./libs/my-sql');

const db = mysql.createPool({host:'localhost',user:'root',password:'123456',port:3306,database:'an_ju_ke'});

const server = new koa();

server.listen(8080);

server.use(async (ctx, next)=>{
  let data = await db.query('SELECT * FROM house_table');

  console.log(data);
})