const mysql = require('koa-mysql');
function createPool(config){
  const db = mysql.createPool(config);
  const _query = db.query.bind(db);
  db.query = function(sql){
    //const fn = ;
    return new Promise((resolve, reject)=>{
      _query(sql)((err,data)=>{
        console.log(data);
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