class Scroll{
  constructor(selector, options){
    this.defauleValues(options);

    let aParent = document.querySelectorAll(selector);
    Array.from(parent).forEach(parent=>{
      let child = parent.children[0];
      if (!child) return;

      let translateX = options.startX;
      let translateY = options.startY;
      child.style.transform = `translateX(${translateX}) translateY(${translateY})`
      child.addEventListener('touchstart', start, false);
      function start(ev){
        let startX = ev.targetTouches[0].clientX;
        let startY = ev.targetTouches[0].clientY;
        let disX = startX - translateX;
        let disY = startY - translateY;
        let dir = '';
        child.addEventListener('touchmove', move, false);
        function move(ev){
          if (options.freeScroll) {
            if(options.scrollY && options.scrollY) {
              translateX = ev.targetTouches[0].clientX - disX;
              translateY = ev.targetTouches[0].clientY - disY;
            } else {
  
            }
          }
        }
        child.addEventListener('touchend', end, false);
        function end(){
          child.removeEventListener('touchmove', move);
          child.removeEventListener('touchend', end);
        }
      }

    })
  }

  defauleValues(options){
    const defaultValue = {
      bounce: true,
      bounceTime: 600,
      scrollX: false,
      scrollY: true,
      freeScroll: false,
      startX: 0,
      startY: 0,
      directionLockThreshold: 5,
    }

    for(name in defaultValue){
      if (!options[name]) {
        options[name] = defaultValue[name];
      }
    }
  }
}