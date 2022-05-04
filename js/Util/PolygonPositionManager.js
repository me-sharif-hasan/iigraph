class PolygonPositionManager{
    constructor(shape){
        this.base=shape;
        this.initEventListeners();
    }

    initEventListeners(){
        let ref=this;
        let shape=this.getBase().getSVGShape();
        let plane=this.getBase().getPlane();
        shape.onmousedown=function(ed){
            let sx=ed.layerX;
            let sy=ed.layerY;
            ref.getBase().highlightBorder(true,undefined);
            shape.onmousemove=plane.onmousemove=function(em){
                let dx=sx-em.layerX;
                let dy=sy-em.layerY;
                ref.getBase().jump(dx,dy);
                sx=em.layerX;
                sy=em.layerY;
                ref.getBase().highlightBorder(true,undefined);
            }
        }
        plane.onmouseup=shape.onmouseup=function(e){
            shape.onmousemove=plane.onmousemove=undefined;
        }
        shape.onmouseover=function(e){
            ref.getBase().highlightBorder(true,undefined);
        }
        shape.onmouseout=function(e){
            if(!ref.getBase().isClicked())
                ref.getBase().highlightBorder(false,undefined);
        }
        shape.onclick=function(e){
            ref.getBase().isClicked(true);
            ref.getBase().highlightBorder(true,true);
        }
    }

    getBase(){
        return this.base;
    }
}