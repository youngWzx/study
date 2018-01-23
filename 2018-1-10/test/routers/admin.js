const express = require('express');
const config = require('../config');
const fs = require('fs');
const common = require('../libs/common');

let router = express.Router();

module.exports = router;

//校验身份
router.use((req,res,next)=>{
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
          req.admin_ID=data[0]['admin_ID'];
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
  let {current,size} = req.query;
  if (!current) {
    current = 1;
  } else if (!/^[1-9]\d*$/.test(current)) {
    current = 1;
  } 

  if (!size) {
    size = 1;
  } else if (!/^[1-9]\d*$/.test(size)) {
    size = 1;
  } 

  req.db.query(`SELECT ID,title,ave_price,tel FROM house_table LIMIT ${(current-1)*size},${size}`, (err,data)=>{
    if (err) {
      res.sendStatus(500);
    } else {
      req.db.query(`SELECT COUNT(*) AS c FROM house_table`, (err,count)=>{
        if (err) {
          res.sendStatus(500);
        } else {
          console.log(count[0].c);
          res.render('index',{
            data,
            total: count[0].c,
            current: parseInt(current),
            size,
          }); 
        }
      })
    }
  })
})

router.post('/house',(req,res)=>{
  //处理时间类型
  req.body['sale_time'] = Math.floor(new Date(req.body['sale_time']).getTime()/1000);
  req.body['submit_time'] = Math.floor(new Date(req.body['submit_time']).getTime()/1000);
  
  let aImg = [];
  let aImgRealPath = [];

  for (let i = 0; i < req.files.length; i++) {
    switch (req.files[i].fieldname) {
      case 'main_img':
        req.body['main_img_path'] = req.files[i].filename;
        req.body['main_img_real_path'] = req.files[i].path.replace(/\\/g, '\\\\');
        break;
      case 'img':
        aImg.push(req.files[i].filename);
        aImgRealPath.push(req.files[i].path.replace(/\\/g,'\\\\'));
        break;
      case 'property_img':
        req.body['property_img_paths'] = req.files[i].filename;
        req.body['property_img_real_paths'] = req.files[i].path.replace(/\\/g,'\\\\');
        break;
      default:
        break;
    }

    req.body['img_paths'] = aImg.join(',');
    req.body['img_real_paths'] = aImgRealPath.join(',');

    req.body['ID'] = common.uuid();
    req.body['admin_ID'] = req.admin_ID;

    let keys = [];
    let values = [];

    for(let key in req.body){
      keys.push(key);
      values.push(req.body[key]);
    }

    let sql = `INSERT INTO house_table (${keys.join(',')}) VALUES ('${values.join("','")}')`
    console.log(sql);

    req.db.query(sql,err=>{
      if (err) {
        console.log(err)
        res.sendStatus(500);
      } else {
        res.redirect('/admin/house')
      }
    })
  }
})

router.get('/house/delete', (req,res)=>{
  const aId = req.query['id'].split(',');
console.log(aId)
  let j = 0; 
  nextDelete();
  function nextDelete() {
    const id = aId[j];
    req.db.query(`SELECT main_img_real_path,img_real_paths,property_img_real_paths from house_table WHERE ID='${id}'`, (err,data)=>{
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        //
        let deleteFile = [];
        let temp = [];
        data[0]['main_img_real_path'] && deleteFile.push(data[0]['main_img_real_path']);
        console.log(deleteFile)

        temp = data[0]['img_real_paths']&&data[0]['img_real_paths'].split(',');

        if (temp) {
          deleteFile = deleteFile.concat(temp);
        }
        console.log(temp)
        temp = data[0]['property_img_real_paths']&&data[0]['property_img_real_paths'].split(',');
        console.log(temp)

        if (temp) {
          deleteFile = deleteFile.concat(temp);
        }

console.log(deleteFile)
        let i = 0;
        nextDeleteFile();
        function nextDeleteFile(){
          if (!deleteFile[i]) {
            req.db.query(`DELETE from house_table WHERE ID='${id}'`, err=>{
              if (err) {
                console.log(err)
                res.sendStatus(500)
              } else {
                j++;
                if (j == aId.length) {
                  res.redirect('/admin/house');
                } else {
                  nextDelete();
                }
              }
            })
          } else {
          fs.unlink(deleteFile[i], err=>{
            if (err) {
              console.log(err)
              res.sendStatus(500);
            } else {
              i++;
              if (i == deleteFile.length) {
                req.db.query(`DELETE from house_table WHERE ID='${id}'`, err=>{
                  if (err) {
                    console.log(err)
                    res.sendStatus(500)
                  } else {
                    j++;
                    if (j == aId.length) {
                      res.redirect('/admin/house');
                    } else {
                      nextDelete();
                    }
                  }
                })
              } else {
                nextDeleteFile()
              }
            }
          })}
        }
      }
    })
  }
})