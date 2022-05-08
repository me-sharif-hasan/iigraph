class Ellipse extends Shape{
    pos=undefined
    constructor(canvas){
      super(canvas,"ellipse");
      this.createEllipse();
    }
    createEllipse(){
        let rand=Math.floor(Math.random()*30)+1;
        let cx=this.canvasWidth/2-this.canvasWidth*30/100/2+rand;
        let cy=this.canvasHeight/2-this.canvasWidth*20/100/2+rand;
        let rx=this.canvasWidth*30/100;
        let ry=this.canvasWidth*20/100;
        this.cxx=cx;
        this.cyy=cy;
        this.rxx=rx;
        this.ryy=ry;
        this.createPoints({0:{"x":cx-rx,"y":cy},1:{"x":cx,"y":cy+ry},2:{"x":cx+rx,"y":cy},3:{"x":cx,"y":cy-ry}});
    }
    createPoints(points){
      if(points!=undefined){
        this.setPoints(points);
      }
      this.addParameter("cx",this.cxx);
      this.addParameter("cy",this.cyy);
      this.addParameter("rx",this.rxx);
      this.addParameter("ry",this.ryy);
      this.borderManager.getManager().redraw();
    }
    setPoints(points){
      this.pos=new Points(points);
    }
    getPoints(){
      if(this.pos==undefined){
        return {}
      }
      return this.pos;
    }
  
    move(dx,dy){
      this.getPoints().shiftTo(dx,dy);
      this.create();
    }
    doResize(dx,dy){
        this.rxx-=dx;
        this.ryy-=dy;
        this.createPoints();
    }
  }
  