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
        let handle={"circles":[],"lines":undefined,"rotator":undefined};
        handle["rotator"]=this.getRotatorDom(x+w,y,x+w/2,y+h/2);
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
    getRotatorDom(x,y,cx,cy){
        let ref=this;
        if(this.rotator==undefined){
        let center=this.shape.createSVGElement("circle");
        let rhandle=this.shape.createSVGElement("circle");

        this.rotator=[rhandle,center];
        $(center).on("drag",function(e){
            let dx=e.difference.x;
            let dy=e.difference.y;
            center.setAttribute("cx",center.getAttribute("cx")-dx);
            center.setAttribute("cy",center.getAttribute("cy")-dy);
        });

        let handSize=function(x,y,px,py){
            return Math.sqrt(Math.pow(x-px,2)+Math.pow(y-py,2));
        }
        let st=0;
        $(rhandle).on("drag",function(e){
            let sp = undefined, mp = undefined;
            mp = {x:center.getAttribute("cx")*1,y:center.getAttribute("cy")*1};
            sp = {x:rhandle.getAttribute("cx")*1,y:rhandle.getAttribute("cy")};
            var p = {x:e.mousemove.layerX, y:e.mousemove.layerY};
            var sAngle = Math.atan2((sp.y-mp.y),(sp.x - mp.x));
            var pAngle = Math.atan2((p.y-mp.y),(p.x - mp.x));        
            let theta = pAngle - sAngle;
            e.theta=theta; 
            
            let fx=Math.cos(theta) * (sp.x-mp.x) - Math.sin(theta) * (sp.y-mp.y) + mp.x;
            let fy=Math.sin(theta) * (sp.x-mp.x) + Math.cos(theta) * (sp.y-mp.y) + mp.y;

            rhandle.setAttribute("cx",fx);
            rhandle.setAttribute("cy",fy);
            if(!st){
                ref.shape.callEvents("before-rotate",e);
                st=1;
            }
            ref.shape.callEvents("do-rotate",e);
            if(e.mouseup){
                ref.shape.callEvents("after-rotate",e);
                st=0;
            }
        });

        }
        let rhandle=this.rotator[0];
        let center=this.rotator[1];
        this.shape.addParameter("stroke",10,rhandle);
        this.shape.addParameter("r",5,rhandle);
        this.shape.addParameter("data-handleid","rotate_handle",rhandle);  

        this.shape.addParameter("stroke",5,center);
        this.shape.addParameter("r",5,center);
        this.shape.addParameter("data-handleid","center_control",center);  

        this.shape.addParameter("cx",x+10,rhandle);
        this.shape.addParameter("cy",y-10,rhandle);
        this.shape.addParameter("cx",cx,center);
        this.shape.addParameter("cy",cy,center);

        return [this.rotator[0]];
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