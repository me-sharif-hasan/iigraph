class Path{
    events={};
    static id=1;
    static objectWiseId=[];
    constructor(canvas){
        Path.id++;
        Path.objectWiseId[this.constructor.name]=(Path.objectWiseId[this.constructor.name]==undefined?1:Path.objectWiseId[this.constructor.name]+1);
        this.name=this.constructor.name+" "+Path.objectWiseId[this.constructor.name];
        this.canvas=canvas;
        this.__init__();
        this.addScaleAdapter(this.group);
        this.addMoveAdapter();
    }
    /**
     * Create SVG element
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
    getBBox(){
        return this.getHookerElement().getBBox();
    }
    allowHandle(flag){
        this.isHandleAllowed=flag;
    }
    /**
     * Create and show handles
     * @param {JSON} handle JSON object with lines and circles
     */
    addHandles(handle){
        if(this.handle!=undefined||this.isHandleAllowed==false) return;
        this.handle=handle;
        this.canvas.append(handle["lines"]);
        let ref=this;
        handle["circles"].forEach(function(elm){
            ref.canvas.append(elm);
        });
        //this.selected(true);
    }
    /**
     * Remove the handles
     */
    removeHandles(){
        if(this.handle!=undefined){
        if(this.handle["lines"]!=undefined) this.handle["lines"].remove();
        if(this.handle["circles"]!=undefined){
            this.handle["circles"].forEach(function(e){e.remove()});
        }
        this.handle=undefined;
        }
        this.removePlaceholder();
        //this.selected(false);
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
    createPlaceholder(d,pathId){
        if(this.placeholder==undefined){
            this.placeholder=[];
        }
        if(this.placeholder[pathId]==undefined){
            this.placeholder[pathId]=this.createSVGElement("path");
            this.canvas.append(this.placeholder[pathId]);
        }
        this.addParameter("d",d,this.placeholder[pathId]);
        this.addParameter("style","visibility:hidden;",this.placeholder[pathId]);
        return this.placeholder[pathId];
    }
    removePlaceholder(){
        if(this.placeholder!=undefined) this.placeholder.map(function(elm){
            elm.remove();
        })
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
        this.fillColor=color;
        let ref=this;
        if(idx==undefined){
            this.path.forEach(function(shape){
                ref.addParameter("fill",color,shape);
            });
        }else{
            ref.addParameter("fill",color,this.path[idx]);
        }
    }
    getFillColor(){
        return this.fillColor;
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
     * @param {Integer?} idx Index of shape in the composition. Can be undefined.
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
        let willUpdate=true;
        this.path.map(function(shape,idx){
            let d=shape.getAttribute("d");
            let sd=ref.scale(dx,dy,d,handle,idx);
            if(sd==false ||!willUpdate||sd.match(NaN)!=null||sd.match(Infinity)!=null) {willUpdate=false;return;}
            allD.push(sd);
        });
        if(willUpdate){
            ref.updatePath(allD);
        }
    }
    /**
     * scale method will scale a path provided by d parameter.
     * @param {Number} dx Scale along x axis.
     * @param {Number} dy Scale along y axis.
     * @param {string[]?} d The path on which scale will be done. 
     * @param {Integer} handle 
     * @returns Scalled path string.
     */
    previousPath=undefined;
    scale(dx,dy,d,handle,pathId){
        let segs=d;
        if(!Array.isArray(d)) segs=parse(d);
        if(segs==false){
            console.warn("Can't parse!");
            return false;
        }
        let bbox=this.getHookerElement().getBBox();
        let w=bbox.width;
        let h=bbox.height;
        let x=bbox.x;
        let y=bbox.y;
        this.previousPath=d;
        let ref=this;
        function shiftx(dx){
            let t=ref.handle["circles"][1].getAttribute("cx")*1;
            let c=ref.handle["circles"][5].getAttribute("cx")*1;
            let tx=(t)*(1-dx/w);
            let tc=(c)*(1-dx/w);
            if(tx>tc){
                return false;
            }
            return true;
        }
        if(!shiftx(dx)) return false;

        function shifty(dy){
            let t=ref.handle["circles"][7].getAttribute("cy")*1;
            let c=ref.handle["circles"][3].getAttribute("cy")*1;
            let tx=(t)*(1-dy/h);
            let tc=(c)*(1-dy/h);
            if(tx>tc){
                return false;
            }
            return true;
        }
        if(!shifty(dy)) return false;

        Object.keys(segs).forEach(function(idx){
            let segType=segs[idx][0].toLowerCase();
            let px=segs[idx][0]>='A'&&segs[idx][0]<='Z'?x:0;
            let py=segs[idx][0]>='A'&&segs[idx][0]<='Z'?y:0;
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
        let b=this.createPlaceholder(pathData,pathId).getBBox();
        if(b.width<1||b.height<1) return false;
        return pathData;
    }
    
    /**
     * moveAll will move whole shape to a new position along x and y axis.
     * @param {Number} dx Shift along x axis.
     * @param {Number} dy Shift along y axis.
     */
    moveAll(dx,dy){
        this.selected(true);
        let ref=this;
        let allD=[];
        this.path.map(function(shape){
            let d=shape.getAttribute("d");
            let sd=ref.move(dx,dy,d);
            allD.push(sd);
        });
        ref.updatePath(allD);
        if(this.isHandleAllowed==false) this.removeHandles();
        this.scaleAdapter.showHandles();
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
    /**
     * Set or get current selection state.
     * @param {boolean} value set the selection state
     * @returns boolean-current selection state
     */
    selected(value){
        if(this.isSelected==undefined) this.isSelected=false;
        if(value!=undefined){
            let temp=this.isSelected;
            this.isSelected=value;
            if(temp!=value){
                this.callEvents("select");
            }
        }
        return this.isSelected;
    }
    /**
     * Send group to one step backward in DOM tree.
     */
    toBack(){
        if(this.getHookerElement().previousElementSibling!=null&&this.getHookerElement().previousElementSibling.tagName=="g")
            this.canvas.insertBefore(this.getHookerElement(),this.getHookerElement().previousElementSibling);
    }
    /**
     * Bring group to one step forward in DOM tree.
     */
    toFront(){
        if(this.getHookerElement().nextElementSibling!=null&&this.getHookerElement().nextElementSibling.tagName=="g")
            this.canvas.insertBefore(this.getHookerElement().nextElementSibling,this.getHookerElement());
    }

    /**
     * Add event listener.
     * @param {string} name name of the event
     * @param {Function} fn Callback function.
     */
    addEventListener(name,fn){
        if(this.events[name]==undefined) this.events[name]=[];
        if(!Array.isArray(fn)){
            fn=[fn];
        }
        let ref=this;
        fn.forEach(function(f){
            ref.events[name].push(f);
        })
    }
    /**
     * Call an event.
     * @param {string} name Event name.
     */
    callEvents(name){
        if(this.events[name]==undefined) this.events[name]=[];
        let ref=this;
        this.events[name].forEach(function(f){
            f(ref);
        })
    }

}