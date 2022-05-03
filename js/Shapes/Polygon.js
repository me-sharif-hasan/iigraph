class Polygon extends Shape{
  pos=undefined
  constructor(canvas){
    super(canvas,"polygon");
  }
  createPoints(points){
    if(points!=undefined){
      this.setPoints(points);
    }
    this.addParameter("points",this.getPoints().getSvgPathPoints());
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

  jump(dx,dy){
    this.getPoints().shiftTo(dx,dy);
    this.createPoints();
  }
}
