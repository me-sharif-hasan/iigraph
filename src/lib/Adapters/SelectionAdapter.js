class SelectionAdapter{
    static allElements=[];
    constructor(canvas,base){
        this.canvas=canvas;
        this.allElements.push(base);
        __init__();
    }
    __init__(){
        let ref=this;
        let canvas=this.canvas;
        let rect=undefined;
        $(canvas).on("drag",function(e){
            if(rect==undefined){
                ref.createSVGElement("rect");
                canvas.appendChild(rect);
            }

            if(e.mouseup){
                rect.remove();
                rect=undefined;
            }
        });
    }
}