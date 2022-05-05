class SelectionMachanism{
    selected_stack=[];
    all_elms=[]
    constructor(canvas){
        this.shapeName="polygon";
        this.selector=this.createSVGDOM();
        this.canvas=canvas;
        canvas.appendChild(this.selector);
        this.initListeners();
    }
    addShapeToList(shape){
        this.all_elms[shape.getId()]=shape;
    }
    initListeners(){
        let ref=this;
        ref.addParameter("fill","#598ab533");
        ref.addParameter("stroke","#2727db");
        ref.addParameter("stroke-dasharray",5);
        $(this.canvas).on("mousedown",function(e){
            if(e.target!=ref.canvas) return;
            ref.addParameter("stroke-width",0.5);
            let sx=e.layerX;
            let sy=e.layerY;
            let points={0:{"x":sx,"y":sy},1:{"x":sx,"y":sy},2:{"x":sx,"y":sy},3:{"x":sx,"y":sy}}
            points=new Points(points);
            let mousemovehandler=function(me){
                let ex=me.layerX;
                let ey=me.layerY;
                points.set(1,{"x":sx,"y":ey});
                points.set(2,{"x":ex,"y":ey});
                points.set(3,{"x":ex,"y":sy});
                ref.addParameter("points",points.getSvgPathPoints())
            }
            $(ref.canvas).on("mousemove",mousemovehandler);

            let clickCapture=function(e){
                e.stopPropagation();
                $(window).unbind("click",clickCapture,true);
            }

            $(ref.canvas).on("mouseup",function(e){
                $(ref.canvas).unbind("mousemove",mousemovehandler);
                let points=ref.selector.getAttribute("points");
                if(points==null||points=="undefined") return;
                points=points.split(" ");
                let bbox=ref.selector.getBBox();
                ref.selectShapes({
                    0:{"x":bbox.x,"y":bbox.y},
                    1:{"x":bbox.x,"y":bbox.y+bbox.height},
                    2:{"x":bbox.x+bbox.width,"y":bbox.y+bbox.height},
                    3:{"x":bbox.x+bbox.width,"y":bbox.y}
                });
                ref.addParameter("stroke-width",0);
                ref.addParameter("points",undefined);
                $(window).on("click",clickCapture,true);
            });
        });
        $(window).on("click",function(e){//click on mouseup problem. somehow worked! I don't know
            if(e.target.id=="canvas"){
                ref.selected_stack.forEach(function(shape){
                    ref.deselect(shape.getId());
                });
                ref.selected_stack=[];
            }
        });
    }
    selectShapes(points){
        let ref=this;
        let bound=new Points(points);
        this.all_elms.forEach(function(elm){
            let isContaining=bound.contains(elm.getPoints());
            if(isContaining){
                ref.select(elm.getId());
            }
        });
    }

    select(id){
        this.selected_stack[id]=this.all_elms[id];
        this.selected_stack[id].markSelected(true);
        this.selected_stack[id].highlightBorder(true,undefined);
    }
    deselect(id){
        this.selected_stack[id].markSelected(false);
        this.selected_stack[id].highlightBorder(undefined,undefined);
        this.selected_stack[id]=undefined;
    }
    createSVGDOM(customShape){
        let shape=document.createElementNS("http://www.w3.org/2000/svg", (customShape==undefined?this.shapeName:customShape));
        return shape;
    }
    addParameter(key,value,obj){
        (obj==undefined?this.selector:obj).setAttributeNS(null, key, value);
    }
    moveAllSelected(dx,dy){
        this.selected_stack.forEach(function(elm){
            elm.move(dx,dy);
        });
    }
}