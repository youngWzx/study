const pathlib=require('path');
const process=require('process');
const fs=require('fs');

let config=null;

function cwd(filename){
  return pathlib.resolve(process.cwd(), filename);
}

try{
  config=require(cwd('my-webpack.config'));
}catch(e){
  console.log('找不到my-webpack.config.js');
}

if(!config){
  return;
}

//
if(!config.entry){
  console.log('配置文件缺少entry');
  return;
}
if(!config.output){
  console.log('配置文件缺少output');
  return;
}

//
for(let name in config.entry){
  let filename=config.entry[name];

  try{
    let buffer=fs.readFileSync(cwd(filename));
    let str=buffer.toString();

    let result=str.replace(/require\([^\(\)]+\)/g, function (str){
      str=str.replace(/^require/, '');

      let filename=eval(str);

      let content='';
      try{
        content=fs.readFileSync(cwd(filename)+'.js').toString();
      }catch(e){
        try{
          content=fs.readFileSync(cwd(filename)).toString();
        }catch(e){
          try{
            content=fs.readFileSync(cwd(filename)+'.json').toString();
          }catch(e){
            console.log(`找不到${filename}`);
            throw new Error(`找不到${filename}`);
          }
        }
      }

      return `(function (){
        const module={};
        module.exports={};

        //原来——自己的
        ${content}

        //加的
        return module.exports;
      })()`;
    })
    .replace(/import mod1 from [\'\"\`]?[^\'\"\`]+[\'\"\`]?/, function (str){
      let arr=str.split(/\s+/g);

      let var_name=arr[1];
      let path=eval(arr[3]);

      let content='';
      try{
        content=fs.readFileSync(cwd(path)+'.js').toString();
      }catch(e){
        try{
          content=fs.readFileSync(cwd(path)+'').toString();
        }catch(e){
          try{
            content=fs.readFileSync(cwd(path)+'.ts').toString();
          }catch(e){
            throw e;
          }
        }
      }


      return `
      const ${var_name}=(function (){
        const module={};
        module.exports={};

        //原来——自己的
        ${content}

        //加的
        return module.exports;
      })();
      `;
    });

    //console.log(result);
    let json=pathlib.parse(config.output.filename);
    try{
      fs.mkdirSync(json.dir);
    }catch(e){}

    fs.writeFileSync(config.output.filename, result);

    console.log('编译成功');
  }catch(e){
    throw e;
    console.log(`找不到入口文件：${filename}`);
  }

}
