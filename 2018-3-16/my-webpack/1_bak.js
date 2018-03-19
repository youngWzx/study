import mod1 from 'libs/mod1'
const mod2=require('libs/mod2');

console.log(a+b);

/*
//期望的结果
const mod1=(function (){
  const module={};
  module.exports={};

  //原来——自己的
  let n1=5;
  let n2=33;

  module.exports={
    a: n1+n2
  };

  exports.c=99;

  //加的
  return module.exports;
})();

const mod2=(function (){
  function show(a){
    return a+5-13;
  }

  module.exports={
    b: show(8)
  };

  //加的
  return module.exports;
})();

console.log(a+b);

*/
