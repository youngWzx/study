const express = require('express');
const config = require('../config');
const common = require('../libs/common');

let router = express.Router();

module.exports = router;

//校验身份
router.use((req,res,next)=>{
  if (!req.session['admin_ID'] && req.url != '/login') {
    res.redirect('/admin/login')
  } else {
    next();
  }
})

router.get('/login',(req,res)=>{
  res.render('login',{error_msg:''})
})

router.post('/login', (req,res) => {
  let {username, password}=req.body;
  // let error_msg = '';
  // let success = false;

  if (username == config.root_username) {
    if (common.md5(password) == config.root_password) {
      console.log('root login');
      req.session['admin_ID']='1';
      res.redirect('/admin/');
      //success = true;
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
          req.session['admin_ID'] = data[0].ID;
          res.redirect('/admin/');
          //success = true;
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
    res.render('login',{error_msg});
  }
})

router.get('/',(req,res)=>{
  console.log('redirect')
  res.redirect('/admin/house');
})

router.get('/house',(req,res)=>{
  res.render('index',{data:[]});
})