class Scroll{
  constructor(selector, options){
    this.defaultValues(options,{
      
    })
    let parent = document.querySelectorAll(selector);
    Array.from(parent).forEach(child=>{

    })
  }
  defaultValues(options, defaults){
    for(let name in defaults){
      if(typeof options[name]=='undefined'){
        options[name]=defaults[name];
      }
    }
  }
}