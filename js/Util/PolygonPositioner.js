class PolygonPositioner{
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
            }
        }
        shape.onmouseup=function(e){
            shape.onmousemove=plane.onmousemove=undefined;
        }
    }

    getBase(){
        return this.base;
    }
}