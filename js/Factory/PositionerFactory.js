class PositionerFactory{
    manager=undefined;
    constructor(shape){
        this.base=shape;
        if(shape instanceof Polygon){
            this.manager=new PolygonPositionManager(shape);
        }else if(shape instanceof Ellipse){
            this.manager=new PolygonPositionManager(shape);
        }else{
            console.log("No manager found for this shape");
        }
    }
}