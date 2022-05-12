class BorderManagerFactory{
    constructor(shape){
        if(shape instanceof Polygon){
            this.manager=new PolygonBorderManager(shape);
        }else if(shape instanceof Ellipse){
            this.manager=new PolygonBorderManager(shape);
        }else{
            console.warn("No bordermagaer for your shape!");
        }
    }
    getManager(){
        return this.manager;
    }
    highlightBorder(border,circles){
        if(this.manager!=undefined&&this.manager.highlightBorder!=undefined){
            this.manager.highlightBorder(border,circles);
        }
    }
}