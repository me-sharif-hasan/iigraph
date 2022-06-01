class HandleManager{
    constructor(shape){
        this.shape=shape;
        this.__init__();
    }
    __init__(){
        let ref=this;
        $(this.shape).on("select",function(shape){
            //if(shape.selected())
                //ref.showHandles();
            //else
                //ref.removeHandles();
        });
    }
    removeHandles(){
        this.shape.removeHandles();
    }
    showHandles(){
        let ref=this;
        let bbox=ref.shape.getBBox();
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

        let group=this.shape.createSVGElement("g");
        let handle={"circles":[],"lines":undefined};
        let id=0;
        points.forEach(function(p){
            if(id<8) handle["circles"].push(ref.createHandleCircle(p[0],p[1],id++));
            d+="L "+p[0]+" "+p[1]+" ";
        });
        let lines=null;
        if(this.handles["lines"]==undefined){
            lines=this.shape.createSVGElement("path");
            this.handles["lines"]=lines;
        }
        else{
            lines=this.handles["lines"];
        }
        this.shape.addParameter("d",d,lines);
        this.shape.addParameter("class","handle-lines",lines);
        handle["lines"]=lines;
        this.shape.addHandles(handle);
    }
    createHandleCircle(cx,cy,id){
        let ref=this;
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
            circle=this.shape.createSVGElement("circle");
            this.handles["circles"][id]=circle;
            $(circle).on("drag",function(e){
                ref.shape.callEvents("scale",[e,id]);
            },false,this);
        }
        this.shape.addParameter("cx",cx,circle);
        this.shape.addParameter("cy",cy,circle);
        this.shape.addParameter("r",4,circle);
        this.shape.addParameter("class","handle-circle",circle);
        this.shape.addParameter("data-handleid",id,circle);  
        this.shape.addParameter("style","cursor:"+this.cursorDecider(id)+";",circle);
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
}