class BorderManagerFactory{
    constructor(shape){
        if(shape instanceof Polygon){
            this.manager=new PolygonBorderManager(shape);
        }
    }
    getManager(){
        return this.manager;
    }
    highlightBorder(flag){
        if(this.manager!=undefined&&this.manager.highlightBorder!=undefined){
            this.manager.highlightBorder(flag);
        }
    }
}