class PolygonResizeManager{
    controlCircles=[];
    constructor(shape){
        this.baseShape=shape;
    }
    resizerControlCircleInit(circle){
        this.controlCircles.push(circle);
        if(circle.id==undefined||circle.id=="") circle.pointid=this.controlCircles.length-1;
        this.init(circle);
    }
    init(circle){
        let base=this.getBase();
        let id=circle.pointid;
        circle.onmouseover=function(e){
            base.highlightBorder(true,true);
        }
        circle.onmousedown=function(e){
            let sx=e.clientX;
            let sy=e.clientY;
            base.isResizing(true);
            base.getPlane().onmousemove=circle.onmousemove=function(me){
                let dx=sx-me.clientX;
                let dy=sy-me.clientY;
                if(base.doResize!=undefined){
                    base.doResize(dx,dy,id);
                }else{
                    console.warn(base.constructor.name+" has no doResize() method");
                }
                sx=me.clientX;
                sy=me.clientY;
                base.addParameter("r",15,circle);
            }
        }
        circle.onmouseup=base.getPlane().onmouseup=function(e){
            circle.onmousemove=base.getPlane().onmousemove=undefined;
            base.isResizing(false);
            base.highlightBorder(false);
        }
        circle.onmouseout=function(e){
            if(circle.onmousemove==undefined){
                base.isResizing(false);
                base.highlightBorder(true,true);
            }
        }
    }
    getBase(){
        return this.baseShape;
    }
}