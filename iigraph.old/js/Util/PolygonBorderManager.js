class PolygonBorderManager{
    constructor(shape){
        this.baseShape=shape;
    }
    updateBorders(){
        this.updatetHighlighter();
        this.updateControllCycles();
    }

    updatetHighlighter(){
        let svgShape=this.getBase().getSVGShape();
        let bounds=svgShape.getBBox();
        let highlightShapeRect=this.getHighlighter();
        if(highlightShapeRect==undefined){
            highlightShapeRect=this.getBase().createSVGDOM("rect");
            this.highlighterRect=highlightShapeRect;
            this.getBase().create(this.getHighlighter());
            this.getBase().addParameter("stroke-width",0,highlightShapeRect);
            this.getBase().addParameter("fill","none",highlightShapeRect);
            this.getBase().addParameter("stroke","#626262",this.getHighlighter());
            this.getBase().addParameter("stroke-dasharray","5",this.getHighlighter());
        }
        this.getBase().addParameter("x",bounds.x-2,highlightShapeRect);
        this.getBase().addParameter("y",bounds.y-2,highlightShapeRect);
        this.getBase().addParameter("width",bounds.width+4,highlightShapeRect);
        this.getBase().addParameter("height",bounds.height+4,highlightShapeRect);
    }

    updateControllCycles(){
        let ref=this;
        if(this.getBase() instanceof Polygon||this.getBase() instanceof Ellipse){
            let points=this.getBase().getPoints();
            console.log(points);
            points.forEachPoint(function(id,point){
                let c=ref.getControlCycle(id);
                ref.getBase().addParameter("cx",point.x,c);
                ref.getBase().addParameter("cy",point.y,c);
                ref.getBase().addParameter("r",0,c);
            })
        }else{
            console.log("error, can't draw point for "+this.getBase().constructor.name);
        }
    }
    getControlCycle(key){
        if(this.controlCycles==undefined) this.controlCycles={};
        if(key==undefined) return this.controlCycles;
        if(this.controlCycles[key]==undefined){
            this.controlCycles[key]=this.getBase().createSVGDOM("circle");
            this.controlCycles[key].pointid=key;
            this.getBase().addParameter("class","control-circle",this.controlCycles[key]);
            this.getBase().create(this.controlCycles[key]);
            this.getBase().resizerControlCircleInit(this.controlCycles[key]);
        }
        return this.controlCycles[key];
    }

    getHighlighter(){
        return this.highlighterRect;
    }
    redraw(){
        this.updateBorders();
    }
    highlightBorder(border,circles){
        let base=this.getBase();
        let ref=this;
        if(border!=undefined)
            this.getBase().addParameter("stroke-width",border*1/2,this.getHighlighter());
        if(circles!=undefined){
            Object.keys(this.controlCycles).forEach(function(key){
                base.addParameter("r",8*circles,ref.getControlCycle(key));
            });
        }
    }

    getBase(){
        return this.baseShape;
    }
}