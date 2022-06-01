class MoveAdapter{
    constructor(shape){
        this.shape=shape;
        $(shape.getHookerElement()).on("drag",function(e){
            if(e.mousemove!=undefined&&shape.parent==undefined){
                shape.callEvents("doMoveAction",[e.difference.x,e.difference.y]);
            }
        },false,this);
    }
}