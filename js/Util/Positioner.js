class Positioner{
    manager=undefined;
    constructor(shape){
        this.base=shape;
        if(shape instanceof Polygon){
            this.manager=new PolygonPositioner(shape);
        }else if(shape instanceof Shape){

        }
    }
}