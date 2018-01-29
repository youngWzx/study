const fs = require('fs');
const assert = require('assert');

module.exports = function(path){
  assert(path, 'path 不能为空');
  assert(typeof path == 'string', 'path应为字符串类型')
  return async function(ctx){
    ctx.response.body = await new Promise((resolve, reject)=>{
      fs.readFile(`${path}${ctx.request.path}`,(err,data)=>{
        if (err) {
          reject(err)
        } else {
          resolve(data.toString());
        }
      })
    })
  }
}