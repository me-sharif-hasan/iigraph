class ScaleAdapter{
    constructor(element){
        this.element=element;
        this.__init__();
    }
    __init__(){
        let ref=this;
        $(this.element).on("click",function(e){
            ref.showHandles();
        });
        $(this.element).on("drag",function(e){
            //console.log(e);
        });
    }

    showHandles(){
        let bbox=this.element.getBBox();
        console.log(bbox);
    }
}