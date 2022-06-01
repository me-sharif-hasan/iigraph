class ShapeEventManager{
    constructor(shape){
        this.shape=shape;
        this.__init__();
    }
    __init__(){
        let ref=this;
        $(window).on("click",function(e){
            if(ref.shape.canvas.contains(e.target)){
                if(ref.shape.getHookerGroup().contains(e.target)){
                    ref.shape.selected(true);
                
                }else{
                    ref.shape.selected(false);
                }
            }
        });
        $(this.shape).on("move",function(e){
            if(ref.shape.handleManager!=undefined){
                ref.shape.handleManager.showHandles();
            }
        });
        $(this.shape).on("scale",function(shape,e){
            console.log("scalling",e);
            let sx=e[0].difference.x,sy=0;
            if(e[1]>=0&&e[1]<=2) sx*=-1;
            if(e[1]==0||e[1]==6||e[1]==7) sy*=-1;
            if(e[1]==1||e[1]==5){
                sy=0;
            }
            if(e[1]==7||e[1]==3){
                sx=0;
            }
            ref.shape.scaleAll(sx,sy,e[1]);
            ref.shape.handleManager.showHandles();
        });
        $(this.shape).on("doMoveAction",function(shape,e){
            ref.shape.selected(true);
            ref.shape.factory.moveAllSelected(e[0],e[1]);
        });
    }
}