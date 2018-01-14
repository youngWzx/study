Buffer.prototype.split=function(str){
  let b1 = this;
  let n;
  let res = [];
  while((n=b1.indexOf(str))!==-1){
    let res1 = b1.slice(0,n);
    res.push(res1);
    b1 = b1.slice(n+str.length);
  }
  res.push(b1);

  return res;
}

exports.parseInfo=function(str){
  //Content-Disposition: form-data; name="f1"; filename="1.txt"\r\n
  //Content-Type: text/plain\r\n
  let json={};
  let arr = str.split('; ');
  let arr2 = [];
  arr.forEach(item => {
    arr2.concat(item.split('\r\n'));
  });

  arr2.forEach(item=>{
    let temp = [];
    if (!item) {
      temp = item.split('=');
      if (temp.length == 2) {
        json[temp[0]] = temp[1].substring(1,temp[1].length-1);
      } else {
        temp = item.split(':');
        json[temp[0]] = temp[1];
      }
    }
  })

  return json;
}