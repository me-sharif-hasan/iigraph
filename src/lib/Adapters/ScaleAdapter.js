class ScaleAdapter{
    /**
     * Set up the machanism of Shape scalling.
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
        $(this.base.getHookerElement()).on("click",function(e){
            ref.showHandles();
        });
        $(this.base.canvas).on("mousedown",function(e){
            if(!ref.base.getHookerElement().contains(e.target)&&e.target.dataset.markerfor==undefined&&e.target.dataset.handleof==undefined){
                ref.base.removeHandles();
                ref.base.selected(false);
            }
            if(e.target.dataset.markerfor!=undefined&&!ref.base.getHookerElement().contains(e.target)){
                if(JSON.parse(e.target.dataset.markerfor)[ref.base.name]){
                    ref.base.selected(true);
                }else{
                    ref.base.selected(false);
                }
            }else if(e.target.dataset.handleof!=ref.base.name&&!ref.base.getHookerElement().contains(e.target)){
                ref.base.selected(false);
            }
        });
    }

    getBBox(){
        return this.element.getBBox();
    }

    showHandles(){
        let ref=this;
        let bbox=this.getBBox();
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
        let lines=null;
        if(this.handles["lines"]==undefined){
            lines=this.base.createSVGElement("path");
            this.handles["lines"]=lines;
        }
        else{
            lines=this.handles["lines"];
        }
        this.base.addParameter("d",d,lines);
        this.base.addParameter("class","handle-lines",lines);
        handle["lines"]=lines;
        this.base.addHandles(handle);
        this.base.selected(true);
    }
    createHandleCircle(cx,cy,id){
        if(this.handles==undefined){
            this.handles={};
        }
        if(this.handles["circles"]==undefined){
            this.handles["circles"]=[];
        }
        let circle=null;
        if(this.handles["circles"][id]!=undefined){
            circle=this.handles["circles"][id];
        }else{
            circle=this.base.createSVGElement("circle");
            this.handles["circles"][id]=circle;
            $(circle).on("drag",this.dragHandler,false,this);
        }
        this.base.addParameter("cx",cx,circle);
        this.base.addParameter("cy",cy,circle);
        this.base.addParameter("r",4,circle);
        this.base.addParameter("class","handle-circle",circle);
        this.base.addParameter("data-handleid",id,circle);  
        this.base.addParameter("data-handleof",this.base.name,circle);  
        this.base.addParameter("style","cursor:"+this.cursorDecider(id)+";",circle);
        return circle;
    }

    dragHandler(e){
        if(!e.data.base.canvas.contains(e.mousemove.target)){
            document.body.style.cursor="default";
            return;
        }
        let handle=e.mousedown.target.getAttribute("data-handleid");
        document.body.style.cursor=e.data.cursorDecider(handle*1);
        let sx=e.difference.x;
        let sy=e.difference.y;
        switch(handle){
            case "0":
                e.data.base.scaleAll(-sx,-sy,handle);
            break;
            case "1":
                e.data.base.scaleAll(-sx,0,handle);
            break;
            case "2":
                e.data.base.scaleAll(-sx,sy,handle);
            break;
            case "3":
                e.data.base.scaleAll(0,sy,handle);
            break;
            case "4":
                e.data.base.scaleAll(sx,sy,handle);
            break;
            case "5":
                e.data.base.scaleAll(sx,0,handle);
            break;
            case "6":
                e.data.base.scaleAll(sx,-sy,handle);
            break;
            case "7":
                e.data.base.scaleAll(0,-sy,handle);
            break;
        }
        e.data.showHandles();
        if(e.mouseup!=undefined){
            document.body.style.cursor="default";
        }
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
}