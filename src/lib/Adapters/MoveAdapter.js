class MoveAdapter{
    constructor(elm,base){
        this.element=elm;
        this.base=base;
        $(elm).on("drag",function(e){
            if(e.mousemove!=undefined) base.moveAll(e.difference.x,e.difference.y);
        },false,this);
    }
}