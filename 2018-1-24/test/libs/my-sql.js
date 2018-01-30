const mysql = require('koa-mysql');
function createPool(config){
  const db = mysql.createPool(config);
  const _db = db;
  db.query = function(sql){
    //const fn = ;
    return new Promise((resolve, reject)=>{
      _db.query(sql)((err,data)=>{
        if (err) {
          reject(err)
        } else {
          resolve(data);
        }
      })
    })
  }

  return db;
}
module.exports = {
  createPool
}