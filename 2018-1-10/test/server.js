const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const mysql = require('mysql');
const config = require('./config');

//搭建服务器
let server = express();
server.listen(config.port);

const db = mysql.createPool({
  host: config.mysql_host, 
  user: config.mysql_user, 
  password: config.mysql_password,
  port: config.mysql_port, 
  database: config.mysql_dbname
});

//中间件
//普通POST数据
server.use(bodyParser.urlencoded({extended: false}));

//文件POST数据
let multerObj = multer({dest: './upload/'});
server.use(multerObj.any());

//cookie
server.use(cookieParser(require('./serct/cookie_key')));
//session
//server.key=require('./serct/sess_key');
server.use(cookieSession({
  keys: require('./serct/sess_key')
}));

//模板
server.set('html', consolidate.ejs);
server.set('view engine', 'ejs');
server.set('views', './template');

//
server.use((req,res,next)=>{
  //console.log(req.url)
  req.db = db;
  next();
})

//处理请求
//let admin_router=express.Router();
server.use('/admin/', require('./routers/admin'));

//let www_router=express.Router();
server.use('/', require('./routers/www'));

//静态文件
server.use(express.static('./www/'))
