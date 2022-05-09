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
    
    doResize(dx,dy,pointid){
      switch(pointid){
      case 0:
        //left side x axis
        this.getPoints().shiftTo(dx,dy,0);
        this.getPoints().shiftTo(-dx,dy,1);
        break;
      case 1:
        //left side x axis
        this.getPoints().shiftTo(dx,dy,1);
        this.getPoints().shiftTo(-dx,dy,0);
        break;  
      case 2:
        //left side x axis
        this.getPoints().shiftTo(dx,dy,2);
        this.getPoints().shiftTo(dx,0,0);
        this.getPoints().shiftTo(dx,0,1);
        break;  
      }
      this.createPoints();
    }
  }
  