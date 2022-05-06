class PolygonPositionManager{
    constructor(shape){
        this.base=shape;
        this.initEventListeners();
    }

    initEventListeners(){
        let base=this.getBase();
        let clicked=false;
        $(base.getSVGShape()).on("click",function(e){
            base.getSelectionMachanism().deselectExcept(base.getId());
            base.getSelectionMachanism().select(base.getId());
            clicked=true;
        });
        $(base.getSVGShape()).on("mouseover",function(e){
            base.highlightBorder(true,undefined);
        });
        $(base.getSVGShape()).on("mouseout",function(e){
            if(!clicked) base.highlightBorder(base.markSelected(),undefined);
        });


        let clickCapture=function(e){
            e.stopPropagation();
            $(window).unbind("click",clickCapture,true);
        }
        
        $(base.getSVGShape()).on("mousedown",function(e){
            let sx=e.clientX;
            let sy=e.clientY;
            let moved=0;
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
                moved++;
            }
            $([base.getSVGShape(),base.getPlane()]).on("mousemove",movehandler);

            let mouseuphandler=function(e){
                $([base.getSVGShape(),base.getPlane()]).unbind("mousemove",movehandler);
                if(moved>0) $(window).on("click",clickCapture,true);
                $([base.getSVGShape(),base.getPlane()]).unbind("mouseup",mouseuphandler);
            }
            $([base.getSVGShape(),base.getPlane()]).on("mouseup",mouseuphandler);
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