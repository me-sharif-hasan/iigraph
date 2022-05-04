class BorderManagerFactory{
    constructor(shape){
        if(shape instanceof Polygon){
            this.manager=new PolygonBorderManager(shape);
        }else if(shape instanceof PremetiveShape){
            this.manager=new PremetiveShapeBorderManager(shape);
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