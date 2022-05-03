class IsoscelesTriangle extends Polygon{
    constructor(canvas){
      super(canvas);
      let x=this.canvasWidth/2-this.canvasWidth*30/100/2;
      let y=this.canvasHeight/2-this.canvasWidth*20/100/2;
      let rx=x+this.canvasWidth*30/100;
      let ry=y;
      let tx=x+(rx-x)/2;
      let ty=y-this.canvasHeight*40/100

      let points={
        0:{
          "x":x,
          "y":y
        },
        1:{
          "x":rx,
          "y":ry
        },
        2:{
          "x":tx,
          "y":ty
        }
      }
      this.createPoints(points);
    }
  
    createBorder(){
      let borderPoints=this.getPoints().getSvgPathPoints();
      this.updateBorder("points",borderPoints);
      this.updateBorder("fill","none");
      this.updateBorder("stroke","red");
    }
    updateDimension(e){
      let mx=e.layerX;
      let my=e.layerY;
  
      let x=this.pos.x;
      let y=this.pos.y;
      let rx=this.pos.rx;
      let ry=this.pos.ry;
  
      let w=Math.abs(rx-x);
      let h=Math.abs(ry-y);
      if(Math.abs(e.sx-this.pos.rx)<Math.abs(e.sx-this.pos.x)) e.dx*=-1;
      if(Math.abs(e.sy-this.pos.ry)<Math.abs(e.sy-this.pos.y)) e.dy*=-1;
      this.pos.x+=e.dx/2;
      this.pos.y+=e.dy/2;
      this.pos.rx-=e.dx/2;
      this.pos.ry-=e.dy/2;
  
      this.createPoints(this.pos.x+","+this.pos.y+" "+this.pos.x+","+this.pos.ry+" "+this.pos.rx+","+this.pos.ry+" "+this.pos.rx+","+this.pos.y);
      this.createBorder();
    }
  }
  