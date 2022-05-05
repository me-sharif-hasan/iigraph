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
        this.canvas.onmousedown=function(e){
            if(e.target!=ref.canvas) return;
            ref.addParameter("stroke-width",0.5);
            let sx=e.layerX;
            let sy=e.layerY;
            let points={
                0:{"x":sx,"y":sy},
                1:{"x":sx,"y":sy},
                2:{"x":sx,"y":sy},
                3:{"x":sx,"y":sy}
            }
            points=new Points(points);
            ref.canvas.onmousemove=function(me){
                let ex=me.layerX;
                let ey=me.layerY;
                points.set(1,{"x":sx,"y":ey});
                points.set(2,{"x":ex,"y":ey});
                points.set(3,{"x":ex,"y":sy});
                ref.addParameter("points",points.getSvgPathPoints())
            }
        }
        window.onmouseup=function(e){
            ref.canvas.onmousemove=undefined;
            let points=ref.selector.getAttribute("points");
            if(points==null||points=="undefined") return;
            points=points.split(" ");
            ref.selectShapes(points[0],points[1],points[2],points[3]);
            ref.addParameter("stroke-width",0);
            ref.addParameter("points",undefined);
        }
        window.onclick=function(e){
            if(e.target.id=="canvas"){
                ref.selected_stack=[];
            }
        }
    }
    selectShapes(a,b,c,d){
        let ref=this;
        a=a.split(",");
        a={"x":a[0],"y":a[1]};
        b=b.split(",");
        b={"x":b[0],"y":b[1]};
        c=c.split(",");
        c={"x":c[0],"y":c[1]};
        d=d.split(",");
        d={"x":d[0],"y":d[1]};

        let bound=new Points({0:a,1:b,2:c,3:d});
        this.all_elms.forEach(function(elm){
            let isContaining=bound.contains(elm.getPoints());
            if(isContaining){
                ref.select(elm,true);
            }
        });

    }

    select(obj,flag){
        this.selected_stack[obj.getId()]=obj;
        obj.highlightBorder(flag,undefined);
    }
    createSVGDOM(customShape){
        let shape=document.createElementNS("http://www.w3.org/2000/svg", (customShape==undefined?this.shapeName:customShape));
        return shape;
    }
    addParameter(key,value,obj){
        (obj==undefined?this.selector:obj).setAttributeNS(null, key, value);
    }
    jump(dx,dy){
        this.selected_stack.forEach(function(elm){
            elm.jump(dx,dy);
        });
    }
}