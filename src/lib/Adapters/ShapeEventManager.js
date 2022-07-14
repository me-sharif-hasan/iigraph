class ShapeEventManager{
    constructor(shape){
        this.shape=shape;
        this.__init__();
    }
    __init__(){
        let ref=this;
        $(ref.shape.getHookerGroup()).on("click",function(e){
            ref.shape.selected(true,e);
        });
        $(window).on('mousedown',function(e){
            if(!ref.shape.canvas.contains(e.target)||e.target.dataset["handleid"]!=undefined) return;
            if(!ref.shape.getHookerGroup().contains(e.target)){
                if(ref.shape.selectedWithCtrl!=true){
                    ref.shape.selected(false,e);
                }
            }
        });
        $(ref.shape.canvas).on("click",function(e){
            if(!e.ctrlKey){
                ref.shape.selectedWithCtrl=false;
                if(!ref.shape.getHookerGroup().contains(e.target)&&e.target.dataset["handleid"]==undefined){
                    ref.shape.selected(false,e);
                }
            }
        })
        $(window).on("keydown",function(e){
            if(ref.shape.selected()){
                ref.shape.selectedWithCtrl=e.ctrlKey;
            }
        });
        $(ref.shape.getHookerElement()).on("drag",function(e){
            if(e.mousemove!=undefined&&ref.shape.parent==undefined){
                ref.shape.callEvents("doMoveAction",[e.difference.x,e.difference.y]);
            }
        },false,this);
        $(this.shape).on("move",function(e){
            if(ref.shape.handleManager!=undefined){
                //ref.shape.handleManager.showHandles();
            }
        });
        $(this.shape).on("scale",function(shape,e){
            let sx=e[0].difference.x,sy=e[0].difference.y;
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
            if(!ref.shape.selectedWithCtrl){
            let ctrlSelected=ref.shape.factory.getCtrlSelectedItems();
            if(ctrlSelected.length>0){
                console.log("CTRL selected exists");
                    ctrlSelected.map(function(shape){
                        shape.selected(false,{"ctrlKey":false});
                    });
                }
            }
            ref.shape.factory.moveAllSelected(e[0],e[1]);
        });

        $(this.shape).on("do-rotate",function(shape,e){
            ref.shape.rotateAll(e.theta);
        });
        $(this.shape).on("before-rotate",function(shape,e){
            ref.shape.setMainOrigin(false);
        });
        $(this.shape).on("after-rotate",function(shape,e){
            ref.shape.setMainOrigin(true);
            ref.shape.handleManager.showHandles();
        });
    }
}