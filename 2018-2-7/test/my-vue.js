Proxy.prototype = Proxy.prototype || Object.prototype;

class MyVue extends Proxy{
  constructor(options){
    let _container = {};
    let data = options.data||{};
    super(data,{
      get(target, key, proxy){
        if (key.startsWith('$')) {
          return _container[key] ||'Not Found';
        } else {
          if (key in target) {
            return target[key];
          } else {
            throw new Error('Not Found');
          }
        }
      },
      set(target, key, val, proxy){
        console.log(val);
        target[key] = val;
      }
    });

    _container.$el = document.querySelector(options.el);
    _container.$data = data;

    _container.render = render.bind(_container);
    _container.render();
  }
}

function eval_str(str, data) {
  str = str.replace(/\w+/g,function(s){
    return 'data.'+s;
  })

  return eval(str);
}

function render(){
  console.log(this.$el)
  //处理{{}}
  this.$el.innerHTML = this.$el.innerHTML.replace(/\{\{[^\}]+\}\}/g,str=>{
    console.log(str)
    str = str.substring(2, str.length - 2);
    return eval_str(str, this.$data);
  })

  //处理：
  const aEl = Array.from(this.$el.getElementsByTagName('*'));
  aEl.push(this.$el);
  aEl.forEach(el=>{
    Array.from(el.attributes).forEach(attr=>{
      if (attr.name.startsWith(':')) {
        let name = attr.name.substring(1);
        let value = eval_str(attr.nodeValue, this.$data);

        el.removeAttribute(attr.name);
        el.setAttribute(name, value);
      }
    })
  })
  console.log(aEl);
  console.log(this.$data)
}