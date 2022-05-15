class Path{
    constructor(canvas){
        this.canvas=canvas;
        this.__init__();
        this.addScaleAdapter(this.group);
        this.addMoveAdapter();
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

    /**
     * addPath will add a new path to the shape given path directive.
     * @param {string} d Path directive.
     */
    addPath(d){
        if(this.path===undefined) {
            this.path=new Array();
        }
        let shape=this.createSVGElement("path");
        this.addParameter("class","shape",shape);
        this.addParameter("d",d,shape);
        this.path.push(shape);
        this.getHookerElement().append(shape);
    }
    /**
     * This function will return the idx'th path if idx is given else it will return all path.
     * @param {Interger} idx Index of the path, index is ordered by cronological manner.
     * @returns Array, contains SVG path.
     */
    getPaths(idx){
        if(idx!=undefined){
            return [this.path[idx]];
        }else{
            return this.path;
        }
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
     * updatePath will update idx'th path if idx is given, else it will update all path.
     * @param {string[]?} d  The path directives. If idx is not given, then it has to be an array.
     * @param {Number} idx Optional. If given, only idx'th path will be updated.
     */
    updatePath(d,idx){
        let ref=this;
        if(idx==undefined){
            if(!Array.isArray(d)){
                if(ref.path.length>1){
                    console.error("d has to be an array of size "+ref.path.length);
                    return;
                }else{
                    d=[d];
                }
            }else if(d.length!=this.path.length){
                console.error("d has to be an array of size "+ref.path.length);
                return;
            }
            this.path.map(function(shape,i){
                ref.addParameter("d",d[i],shape);
            });
        }else{
            ref.addParameter("d",d,this.path[idx]);
        }
    }
    addScaleAdapter(){
        this.scaleAdapter=new ScaleAdapter(this.getHookerElement(),this);
    }
    addMoveAdapter(){
        this.moveAdapter=new MoveAdapter(this.getHookerElement(),this);
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
     * fill will set the fill color to the shape.
     * @param {Number} width Fill color.
     * @param {Integer} idx Index of shape in the composition. Can be undefined.
     */
    fill(color,idx){
        let ref=this;
        if(idx==undefined){
            this.path.forEach(function(shape){
                ref.addParameter("fill",color,shape);
            });
        }else{
            ref.addParameter("fill",color,this.path[idx]);
        }
    }
    /**
     * stroke will set the stroke color to the shape.
     * @param {Number} width Stroke color.
     * @param {Integer} idx Index of shape in the composition. Can be undefined.
     */
    stroke(color,idx){
        let ref=this;
        if(idx==undefined){
            this.path.forEach(function(shape){
                ref.addParameter("stroke",color,shape);
            });
        }else{
            ref.addParameter("stroke",color,this.path[idx]);
        }
    }
    /**
     * strokeWidth will set the stroke width to the shape.
     * @param {Number} width Stroke width.
     * @param {Integer} idx Index of shape in the composition. Can be undefined.
     */
    strokeWidth(width,idx){
        let ref=this;
        if(idx==undefined){
            this.path.forEach(function(shape){
                ref.addParameter("stroke-width",width,shape);
            });
        }else{
            ref.addParameter("stroke-width",width,this.path[idx]);
        }
    }
    
    /**
     * scaleAll scales all the shapes in the group.
     * @param {Number} dx Scale along x axis.
     * @param {Number} dy Scale along y axis.
     * @param {Integer} handle Corner at which user is dragging.
     */
    scaleAll(dx,dy,handle){
        let ref=this;
        let allD=[];
        this.path.map(function(shape){
            let d=shape.getAttribute("d");
            let sd=ref.scale(dx,dy,d,handle);
            allD.push(sd);
        });
        ref.updatePath(allD);
    }
    /**
     * scale method will scale a path provided by d parameter.
     * @param {Number} dx Scale along x axis.
     * @param {Number} dy Scale along y axis.
     * @param {string[]?} d The path on which scale will be done. 
     * @param {Integer} handle 
     * @returns Scalled path string.
     */
    scale(dx,dy,d,handle){
        let segs=d;
        if(!Array.isArray(d)) segs=parse(d);
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
        let pathData=this.move(dx,dy,segs);
        let pch=this.createPlaceholder(pathData).getBBox();
        if(pch.width<30||pch.height<30) return d;
        return pathData;
    }
    
    /**
     * moveAll will move whole shape to a new position along x and y axis.
     * @param {Number} dx Shift along x axis.
     * @param {Number} dy Shift along y axis.
     */
    moveAll(dx,dy){
        this.removeHandles();
        let ref=this;
        let allD=[];
        this.path.map(function(shape){
            let d=shape.getAttribute("d");
            let sd=ref.move(dx,dy,d);
            allD.push(sd);
        });
        ref.updatePath(allD);
    }
    /**
     * moveAll will move specific path string to a new position along x and y axis.
     * @param {Number} dx Shift along x axis.
     * @param {Number} dy Shift along y axis.
     */
    move(dx,dy,d){
        let segs=d;
        if(!Array.isArray(d)) segs=parse(d);
        if(dx==undefined||dy==undefined) return Array.isArray(d)?serialize(d):d;
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
        return serialize(segs);
    }

}