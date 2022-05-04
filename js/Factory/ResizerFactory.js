class ResizerFactory{
    constructor(shape){
        if(shape instanceof Polygon){
            this.manager=new PolygonResizeManager(shape);
        }else if(shape instanceof PremetiveShape){
            this.manager=new PolygonResizeManager(shape);
        }else{
            console.warn(shape.constructor.name+" has no reisize manager");
        }
    }
    resizerControlCircleInit(circle){
        if(this.manager!=undefined){
            this.manager.resizerControlCircleInit(circle);
        }else{
            console.log("No manager found for your shape type");
        }
    }
}