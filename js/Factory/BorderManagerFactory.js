class BorderManagerFactory{
    constructor(shape){
        if(shape instanceof Polygon){
            this.manager=new PolygonBorderManager(shape);
        }
    }
    getManager(){
        return this.manager;
    }
}