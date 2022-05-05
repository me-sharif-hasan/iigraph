class PolygonPositionManager{
    constructor(shape){
        this.base=shape;
        this.initEventListeners();
    }

    initEventListeners(){
        let base=this.getBase();
        let clicked=false;
        $(base.getSVGShape()).on("click",function(e){
            base.highlightBorder(true,undefined);
            clicked=true;
        });
        $(base.getSVGShape()).on("mouseover",function(e){
            base.highlightBorder(true,undefined);
        });
        $(base.getSVGShape()).on("mouseout",function(e){
            if(!clicked) base.highlightBorder(base.markSelected(),undefined);
        });
        $(base.getSVGShape()).on("mousedown",function(e){
            let sx=e.clientX;
            let sy=e.clientY;
            let movehandler=function(mx){
                let dx=sx-mx.clientX;
                let dy=sy-mx.clientY
                if(!base.markSelected()){
                    base.move(dx,dy);
                }
                else{
                    base.getSelectionMachanism().moveAllSelected(dx,dy);
                }
                sx=mx.clientX;
                sy=mx.clientY;
            }
            $([base.getSVGShape(),base.getPlane()]).on("mousemove",movehandler);
            $([base.getSVGShape(),base.getPlane()]).on("mouseup",function(e){
                $([base.getSVGShape(),base.getPlane()]).unbind("mousemove",movehandler);
            })
        });
        $(window).on("click",function(e){
            if(e.target.id=="canvas"){
                base.highlightBorder(base.markSelected(),undefined);
                clicked=false;
            }
        })
    }

    getBase(){
        return this.base;
    }
}