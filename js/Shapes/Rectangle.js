class Rectangle extends Polygon{
  constructor(canvas){
    super(canvas);
    let x=this.canvasWidth/2-this.canvasWidth*30/100/2;
    let y=this.canvasHeight/2-this.canvasWidth*20/100/2;
    let rx=x+this.canvasWidth*30/100;
    let ry=y+this.canvasHeight*20/100;
    
    let points={
      0:{
        "x":x,
        "y":y
      },
      1:{
        "x":x,
        "y":ry
      },
      2:{
        "x":rx,
        "y":ry
      },
      3:{
        "x":rx,
        "y":y
      }
    }
    this.createPoints(points);
  }

  doResize(dx,dy,pointId){
    switch(pointId){
      case 0:
        //left side x axis
        this.getPoints().shiftTo(dx,0,0);
        this.getPoints().shiftTo(dx,0,1);
        //top side y axis
        this.getPoints().shiftTo(0,dy,0);
        this.getPoints().shiftTo(0,dy,3);
        break;
      case 1:
        //left side x axis
        this.getPoints().shiftTo(dx,0,0);
        this.getPoints().shiftTo(dx,0,1);
        //bottom side y axis
        this.getPoints().shiftTo(0,dy,1);
        this.getPoints().shiftTo(0,dy,2);
        break;
      case 2:
        //right side x axis
        this.getPoints().shiftTo(dx,0,2);
        this.getPoints().shiftTo(dx,0,3);
        //bottom side y axis
        this.getPoints().shiftTo(0,dy,1);
        this.getPoints().shiftTo(0,dy,2);
        break;
      case 3:
        //right side x axis
        this.getPoints().shiftTo(dx,0,2);
        this.getPoints().shiftTo(dx,0,3);
        //top side y axis
        this.getPoints().shiftTo(0,dy,0);
        this.getPoints().shiftTo(0,dy,3);
        break;
      default:
        console.warn("It's a recangle!, it can't have point "+pointId);
    }

    this.createPoints();
  }
}
