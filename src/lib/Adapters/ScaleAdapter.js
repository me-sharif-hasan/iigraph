class ScaleAdapter{
    /**
     * 
     * @param {SVG elements} element The SVG element which will be scalled.
     * @param {Path} base For appending of handles.
     */
    constructor(element,base){
        this.element=element;
        this.base=base;
        this.__init__();
    }
    __init__(){
        let ref=this;
        $(window).on("click",function(e){
            if(e.target.parentNode.isEqualNode(ref.element)){
                ref.showHandles();
            }else{
                ref.base.removeHandles();
            }
        });
        $(this.element).on("drag",function(e){
            //console.log(e);
        });
    }

    showHandles(){
        let ref=this;
        let bbox=this.element.getBBox();
        let x=bbox.x,y=bbox.y,w=bbox.width,h=bbox.height;
        let points=[];
        points.push([x,y]);
        points.push([x,y+h/2]);
        points.push([x,y+h]);
        points.push([x+w/2,y+h]);
        points.push([x+w,y+h]);
        points.push([x+w,y+h/2]);
        points.push([x+w,y]);
        points.push([x+w/2,y]);
        points.push([x,y]);
        
        let d="M "+x+" "+y+" ";

        let group=this.base.createSVGElement("g");
        let handle={"circles":[],"lines":undefined};
        let id=0;
        points.forEach(function(p){
            if(id<8) handle["circles"].push(ref.createHandleCircle(p[0],p[1],id++));
            d+="L "+p[0]+" "+p[1]+" ";
        });
        let lines=this.base.createSVGElement("path");
        this.base.addParameter("d",d,lines);
        this.base.addParameter("class","handle-lines",lines);
        handle["lines"]=lines;
        this.base.addHandles(handle);
    }
    createHandleCircle(cx,cy,id){
        let circle=this.base.createSVGElement("circle");
        this.base.addParameter("cx",cx,circle);
        this.base.addParameter("cy",cy,circle);
        this.base.addParameter("r",4,circle);
        this.base.addParameter("class","handle-circle",circle);
        this.base.addParameter("data-handleid",id,circle);  
        this.base.addParameter("style","cursor:"+this.cursorDecider(id)+";",circle);
        $(circle).on("drag",this.scaler);
        return circle;
    }
    cursorDecider(id){
        let cursor="resize";
        switch(id){
            case 0:
                cursor="se";
                break;
            case 1:
                cursor="w";
                break;
            case 2:
                cursor="sw"
                break;
            case 3:
                cursor="s";
                break;
            case 4:
                cursor="se";
                break;
            case 5:
                cursor="w";
                break;
            case 6:
                cursor="sw";
                break;
            case 7:
                cursor="s";
                break;
        }
        cursor+="-resize";
        return cursor;
    }
    scaler(e){
        let id=e.mouseDown.target.getAttribute("data-handleid");
        let cursor=e.mouseDown.target.style.cursor;
        document.body.style.cursor=cursor;
        e.mouseDown.target.setAttributeNS(null,"class","handle-circle-hover");
        if(e.mouseUp!=undefined){
            document.body.style.cursor="default";
            e.mouseDown.target.setAttributeNS(null,"class","handle-circle");
        }
    }
}
