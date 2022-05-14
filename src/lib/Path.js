class Path{
    constructor(canvas){
        this.canvas=canvas;
        this.__init__();
        this.addScaleAdapter(this.group);
    }
    /**
     * 
     * @param {string} name SVG element name.
     * @returns The SVG element.
     */
    createSVGElement(name){
        return document.createElementNS("http://www.w3.org/2000/svg",name)
    }
    __init__(){
        this.group=this.createSVGElement("g");
        this.path=this.createSVGElement("path");
        this.group.append(this.path);
        this.canvas.append(this.group);
    }
    addHandles(handle){
        this.handle=handle;
        this.canvas.append(handle["lines"]);
        let ref=this;
        handle["circles"].forEach(function(elm){
            ref.canvas.append(elm);
        });
    }
    removeHandles(){
        if(this.handle!=undefined){
        if(this.handle["lines"]!=undefined) this.handle["lines"].remove();
        if(this.handle["circles"]!=undefined){
            this.handle["circles"].forEach(function(e){e.remove()});
        }
        this.handle=undefined;
        }
        this.removePlaceholder();
    }
    /**
     * 
     * @param {string} parameterName Name of the parameter.
     * @param {*} parameterValue Value of the parameter.
     * @param {SVGElement} element SVG element. If undefined then path itself will be considered.
     */
    addParameter(parameterName,parameterValue,element){
        (element==undefined?this.group:element).setAttributeNS(null, parameterName, parameterValue);
    }

    createPlaceholder(d){
        if(this.placeholder==undefined){
            this.placeholder=this.createSVGElement("path");
            this.canvas.append(this.placeholder);
        }
        this.addParameter("d",d,this.placeholder);
        this.addParameter("style","visibility:hidden;",this.placeholder);
        return this.placeholder;
    }
    removePlaceholder(){
        if(this.placeholder!=undefined) this.placeholder.remove();
        this.placeholder=undefined;
    }
    
    /**
    * updatePath
    * @param {string} path - path for SVG path
    */
    
    updatePath(path){
        this.addParameter("d",path,this.path);
    }
    addScaleAdapter(){
        this.scaleAdapter=new ScaleAdapter(this.getHookerElement(),this);
    }
    /**
     * 
     * @returns Returns the current group.
     */
    getHookerElement(){
        return this.group;
    }

    /* SVG related methods*/
    /**
     * Set fill color
     * @param {String} color Color
     */
    fill(color){
        this.addParameter("fill",color,this.path);
    }
    stroke(color){
        this.addParameter("stroke",color,this.path);
    }
    strokeWidth(width){
        this.addParameter("stroke-width",width,this.path);
    }
    scaleAll(dx,dy,handle){
        let d=this.path.getAttribute("d");
        let segs=parse(d);
        if(segs==false){
            console.warn("Can't parse!");
            return;
        }
        let bbox=this.getHookerElement().getBBox();
        let w=bbox.width;
        let h=bbox.height;
        let x=bbox.x;
        let y=bbox.y;
        Object.keys(segs).forEach(function(idx){
            let segType=segs[idx][0].toLowerCase();
            //d+=segs[idx][0];
            let px=segs[idx][0]>='A'&&segs[idx][0]<='Z'?x:0;
            let py=segs[idx][0]>='A'&&segs[idx][0]<='Z'?y:0;
            //console.log(px,py);
            if(segType=='a'){
                segs[idx][1]=px+(segs[idx][1]-px)*(1-dx/w);
                segs[idx][2]=py+(segs[idx][2]-py)*(1-dy/h);

                segs[idx][6]=px+(segs[idx][6]-px)*(1-dx/w);
                segs[idx][7]=py+(segs[idx][7]-py)*(1-dy/h);
            }else if(segType=='v'){
                segs[idx][1]=py+(segs[idx][1]-py)*(1-dy/h);
            }else if(segType=='h'){
                segs[idx][1]=px+(segs[idx][1]-px)*(1-dx/w);
            }else{
                for(let i=1;i<segs[idx].length;i++){
                    if(i%2==1){
                        segs[idx][i]=px+(segs[idx][i]-px)*(1-dx/w);
                    }else{
                        segs[idx][i]=py+(segs[idx][i]-py)*(1-dy/h);
                    }
                }
            }

        });
        handle*=1;
        switch(handle){
            case 0:
                dx*=-1;
                dy*=-1;
                break;
            case 1:
                dx*=-1;
                break;
            case 2:
                dx*=-1;
                dy*=0;
                break;
            case 3:
                dx*=-1;
                dy*=0;
                break;
            case 4:
                dx*=0;
                dy*=0;
                break;
            case 5:
                dx*=0;
                dy*=0;
                break;
            case 6:
                dx*=0;
                dy*=-1;
                break;
            case 7:
                dx*=0;
                dy*=-1;
                break;
        }
        segs=this.moveAll(dx,dy,segs);
        let pathData=serialize(segs);
        let pch=this.createPlaceholder(pathData).getBBox();
        if(pch.width<30||pch.height<30) return;
        this.updatePath(pathData);
    }
    moveAll(dx,dy,segs){
        if(!Array.isArray(segs)) segs=parse(segs);
        Object.keys(segs).forEach(function(idx){
            let segType=segs[idx][0];
            if(segType=='A'){
                segs[idx][1]-=dx;
                segs[idx][2]-=dy;

                segs[idx][6]-=dx;
                segs[idx][7]-=dy;
            }else if(segType=='V'){
                segs[idx][1]-=dy;
            }else if(segType=='H'){
                segs[idx][1]-=dx;
            }else if(segType>='A'&&segType<='Z'){
                for(let i=1;i<segs[idx].length;i++){
                    if(i%2==1){
                        segs[idx][i]-=dx;
                    }else{
                        segs[idx][i]-=dy;
                    }
                }
            }else{
               // console.log("Ignoring: ",segType);
            }

        });
        
        return segs;
    }

}