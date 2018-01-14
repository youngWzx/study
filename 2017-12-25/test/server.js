const http = require('http');
const url = require('url');
const common = require('./libs/common');

let server = http.createServer((req, res)=>{
  const {pathname, query}=url.parse(req.url, true);
  console.log('接收到了GET请求', pathname, query)

  let aBuffer=[];

  req.on('data',(data)=>{
    aBuffer.push(data);
  })

  req.on('end',function(){
    let data = Buffer.concat(aBuffer);
    let contentType = req.headers['content-type']; 
    if (contentType.startsWith('multipart/form-data')) {
      const boundary = '--' + contentType.split('; ')[1].split('=')[1];
      let arr = data.split(boundary);
      arr.shift();
      arr.pop();
      //第三步、每一项的头尾扔掉(\r\n....\r\n)
      arr=arr.map(item=>item.slice(2, item.length-2));
      arr.forEach(item => {
        
      });
    }
  })
});

server.listen(8080);