const url=require('url');

let str='https://www.baidu.com:8080/s?ie=utf-8&f=8&rsv_bp=0&rsv_idx=1&tn=baidu&wd=asdf&rsv_pq=f0d39c890002c5e9&rsv_t=1dd7WV2OmK1tbiDxpR3MMFAWwEIbv15YzPVssqUxcQ1XydNE5FDi7bo9fRk&rqlang=cn&rsv_enter=1&rsv_sug3=4&rsv_sug1=1&rsv_sug7=100&rsv_sug2=0&inputT=249&rsv_sug4=248';

let obj=url.parse(str, true);

console.log(obj);
