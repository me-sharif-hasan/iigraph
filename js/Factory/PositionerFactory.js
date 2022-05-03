class PositionerFactory{
    manager=undefined;
    constructor(shape){
        this.base=shape;
        if(shape instanceof Polygon){
            console.log(shape);
            this.manager=new PolygonPositionManager(shape);
        }else if(shape instanceof Shape){

        }
    }
}