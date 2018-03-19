
      const mod1=(function (){
        const module={};
        module.exports={};

        //原来——自己的
        let n1=5;
let n2=33;

module.exports={
  a: n1+n2
};


        //加的
        return module.exports;
      })();
      
const mod2=(function (){
        const module={};
        module.exports={};

        //原来——自己的
        function show(a){
  return a+5-13;
}

module.exports={
  b: show(8)
};


exports.c=99;


        //加的
        return module.exports;
      })();

console.log(mod1.a+mod2.b);
