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
            shape.onmousemove=plane.onmousemove=function(em){
                let dx=sx-em.layerX;
                let dy=sy-em.layerY;
                ref.getBase().jump(dx,dy);
                sx=em.layerX;
                sy=em.layerY;
                ref.getBase().highlightBorder(true);
            }
        }
        plane.onmouseup=shape.onmouseup=function(e){
            shape.onmousemove=plane.onmousemove=undefined;
        }
        shape.onmouseover=function(e) {
            ref.getBase().highlightBorder(true);
        }
        shape.onmouseout=function(e) {
            ref.getBase().highlightBorder(false);
        }
    }

    getBase(){
        return this.base;
    }
}