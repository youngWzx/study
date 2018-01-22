const express = require('express');
const config = require('../config');
const common = require('../libs/common');

let router = express.Router();

module.exports = router;

//校验身份
router.use((req,res,next)=>{
  console.log(req.path)
  if (!req.cookies['admin_token'] && req.path!='/login') {
    res.redirect(`/admin/login?ref=${req.url}`);
  } else{
    if (req.path=='/login') {
      next();
    } else {
      req.db.query(`SELECT * FROM admin_token_table WHERE ID='${req.cookies['admin_token']}'`,(error,data)=>{
        if (error) {
          res.sendStatus(500);
        } else if (data.length == 0) {
          res.redirect(`/admin/login?ref=${req.url}`)
        } else{
          req.admin_ID=data[0]['admin_table'];
          next();
        }
      })
    }
  }
})

router.get('/login',(req,res)=>{
  res.render('login',{error_msg:'',ref:req.query['ref']||''})
})

router.post('/login', (req,res) => {
  let {username, password}=req.body;

  function setToken(id){
    let ID = common.uuid();
    let time = new Date();
    time.setMinutes(time.getMinutes()+20);
    let t = Math.floor(time.getTime()/1000)
    req.db.query(`INSERT INTO admin_token_table (ID, admin_ID, expires) VALUES ('${ID}', '${id}', ${t})`,err=>{
      if (err) {
        console.log(err)
        res.sendStatus(500);
      } else {
        res.cookie('admin_token', ID);
        let ref = req.query['ref']||'';
        res.redirect('/admin'+ref);
      }
    })
  }
  if (username == config.root_username) {
    if (common.md5(password) == config.root_password) {
      console.log('root login success');
      setToken(1);
    } else {
      console.log('root login failed');
      //error_msg='用户名或密码错误';
      showError('用户名或密码错误')
    }
  } else {
    req.db.query(`SELECT * FROM admin_table WHERE username='${username}'`,(err,data)=>{
      if (err) {
        //error_msg='数据库有错';
        showError('数据库有错')
      } else if (data.length==0) {
        //error_msg = '用户名或密码错误';
        showError('用户名或密码错误')
      } else {
        if (data[0].password == common.md5(password)) {
          setToken(data[0].ID)
          console.log('普通管理员登陆成功');
        } else {
          //error_msg = '用户名或密码错误';
          showError('用户名或密码错误')
        }
      }
    })
  }

  // if (!success) {
  //   res.render('login',{error_msg})
  // }

  function showError(error_msg) {
    res.render('login',{error_msg,ref:req.query['ref']||''});
  }
})

router.get('/',(req,res)=>{
  console.log('redirect')
  res.redirect('/admin/house');
})

router.get('/house',(req,res)=>{
  req.db.query('SELECT ID,title,ave_price,tel FROM house_table', (err,data)=>{
    if (err) {
      res.sendStatus(500);
    } else {
      res.render('index',{data}); 
    }
  })
})

router.post('/house',(req,res)=>{
  //处理时间类型
  req.body['sale_time'] = Math.floor(new Date(req.body['sale_time']).getTime()/1000);
  req.body['submit_time'] = Math.floor(new Date(req.body['submit_time']).getTime()/1000);
  
  console.log(req.body);
  console.log(req.files)
})