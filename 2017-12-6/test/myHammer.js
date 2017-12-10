class MyHammer{
  constructor(obj, options){
    this.eventQue=[];
    this.startTime=0;
    this.timer=null;
    this.start=this.start.bind(this);
    this.move=this.move.bind(this);
    this.end=this.end.bind(this);

    obj.addEventListener('touchstart', this.start, false)
    obj.addEventListener('touchmove', this.move, false)
    obj.addEventListener('touchend', this.end, false)
  }

  triggetEvent(type){
    this.eventQue.forEach(event=>{
      if (event.type === type) {
        event.fn();
      }
    })
  }

  on(type,fn){
    this.eventQue.push({
      type,
      fn
    })
    return this;
  }

  off(type){
    this.eventQue = this.eventQue.filter(event=>event.type !== type)
  }

  start(ev){
    this.startTime=Date.now();

    clearTimeout(this.timer);
    this.timer = setTimeout(()=>{
      this.triggetEvent('press')
    },250)
  }

  move(ev){

  }

  end(ev){
    if (Date.now() - this.startTime < 250) {
      clearTimeout(this.timer);
      this.triggetEvent('tap')
    }
  }
}