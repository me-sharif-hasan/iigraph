class PolygonResizeManager{
    controlCircles=[];
    constructor(shape){
        this.baseShape=shape;
        this.initListeners();
    }
    resizerControlCircleInit(circle){
        this.controlCircles.push(circle);
        if(circle.pointid==undefined||circle.pointid=="") circle.pointid=this.controlCircles.length-1;
        this.init(circle);
    }
    init(circle){
        let base=this.getBase();
        $(base.getSVGShape()).on("click",function(e){
            base.highlightBorder(undefined,true);
        });
        $(circle).on("mousedown",function(e){
            let sx=e.clientX;
            let sy=e.clientY;
            let handler=function(mx){
                let dx=sx-mx.clientX;
                let dy=sy-mx.clientY;
                base.doResize(dx,dy,circle.pointid*1);
                sx=mx.clientX;
                sy=mx.clientY;
                base.highlightBorder(undefined,true);
            }
            $([circle,base.getPlane()]).on("mousemove",handler);
            let actionremovehandler=function(e){
                $([circle,base.getPlane()]).unbind("mousemove",handler);
            }
            $([circle,base.getPlane()]).on("mouseup",actionremovehandler);
        });
        $(window).on("click",function(e){
            if(e.target.id=="canvas"){//TODO: need to find a better alternative
                base.highlightBorder(undefined,false);
            }
        })
    }
    initListeners(){

    }
    getBase(){
        return this.baseShape;
    }
}