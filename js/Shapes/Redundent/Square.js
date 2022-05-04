class Square extends PremetiveShape{
    constructor(canvas){
      super(canvas,"rect");
      let x=this.canvasWidth/2-this.canvasWidth*30/100/2;
      let y=this.canvasHeight/2-this.canvasWidth*20/100/2;
      let r=this.canvasWidth*30/100;
      this.set("x",x);
      this.set("y",y);
      this.set("width",r);
      this.set("height",r);
      this.createPoints();
      this.setJumpHandler(function(dx,dy){
        this.set("x",this.get("x")-dx);
        this.set("y",this.get("y")-dy);
        this.createPoints();
      });
    }
    doResize(dx,dy,pointId){
      switch(pointId){
        case 0:
            this.set("x",this.get("x")-dx);
            this.set("y",this.get("y")-dy);
            this.set("width",this.get("width")+dx);
            this.set("height",this.get("width")+dy);
            break;
        case 1:
            points.shiftTo(dx,dy,1);
            points.shiftTo(-dx,-dy,3);
            break;
        case 2:
            points.shiftTo(dx,dy,0);
            break;
        case 3:
            points.shiftTo(dx,dy,1);
            points.shiftTo(-dx,-dy,3);
            break;
        case 4:
            points.shiftTo(dx,dy,0);
            break;
        case 5:
            points.shiftTo(dx,dy,1);
            points.shiftTo(-dx,-dy,3);
            break;
        case 6:
            points.shiftTo(dx,dy,0);
            break;
        case 7:
            points.shiftTo(dx,dy,1);
            points.shiftTo(-dx,-dy,3);
            break;
        default:
          console.warn("It's a recangle!, it can't have point "+pointId);
      }
      if(this.get("width")<2){
        this.set("width",2);
        this.set("height",this.get("width")+dy);
      }
      this.createPoints();
    }
  }
  