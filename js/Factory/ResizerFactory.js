class ResizerFactory{
    constructor(shape){
        if(shape instanceof Polygon){
            this.manager=new PolygonResizeManager(shape);
        }
    }
    resizerControlCircleInit(circles){
        if(this.manager!=undefined){
            this.manager.resizerControlCircleInit(circles);
        }else{
            console.log("No manager found for your shape type");
        }
    }
}