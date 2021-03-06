class Path{
    events={};
    static id=1;
    static objectWiseId=[];
    constructor(canvas){
        this.start();
    }
    start(){
        Path.id++;
        Path.objectWiseId[this.constructor.name]=(Path.objectWiseId[this.constructor.name]==undefined?1:Path.objectWiseId[this.constructor.name]+1);
        this.name=this.constructor.name+" "+Path.objectWiseId[this.constructor.name];
        this.canvas=canvas;
        this.__init__();
        this.addEventManager();
        this.addHandleManager();
    }
    /**
     * Add parent to the shape which also set the child to the parent
     * @param {Shape} parent The parent of a shape.
     */
    addParent(parent){
        let hooker=this.getHookerElement();
        hooker.remove();
        if(parent!=undefined){
            parent.append(this);
            this.parent=parent;
            parent.addChild(this);
        }else{
            this.parent.addChild(undefined);
            this.canvas.append(hooker);
            this.parent=undefined;
        }
    }
    /**
     * Add child to the shape. It won't set the parent for you
     * @param {Shape} shape Child shape.
     */
    addChild(shape){
        this.child=shape;
    }
    /**
     * Create SVG element
     * @param {string} name SVG element name.
     * @returns The SVG element.
     */
    detach(){
        if(this.parent!=undefined){
            this.addParent(undefined);
        }
    }
    createSVGElement(name){
        return document.createElementNS("http://www.w3.org/2000/svg",name)
    }
    __init__(){
        this.group=this.createSVGElement("g");
        if(this.parent==undefined){
            this.canvas.append(this.group);
        }else{
            this.parent.append(this);
        }
    }
    append(shape){
        this.getHookerElement().append(shape.getHookerElement());
    }
    getBBox(){
        return this.getHookerGroup().getBBox();
    }
    allowHandle(flag){
        this.isHandleAllowed=flag;
    }
    /**
     * Create and show handles
     * @param {JSON} handle JSON object with lines and circles
     */
    addHandles(handle){
        if(this.handle!=undefined||this.isHandleAllowed==false||this.parent!=undefined) return;
        this.handle=handle;
        this.canvas.append(handle["lines"]);
        let ref=this;
        handle["circles"].forEach(function(elm){
            ref.canvas.append(elm);
        });
        handle["rotator"].forEach(function(elm){
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
        if(this.handle["rotator"]!=undefined){
            this.handle["rotator"].forEach(function(e){e.remove()});
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
    addHandleManager(){
        this.handleManager=new HandleManager(this);
    }
    addEventManager(){
        this.eventManager=new ShapeEventManager(this);
    }
    /**
     * 
     * @returns Returns the current group.
     */
    getHookerElement(){
        return this.group;
    }
    getHookerGroup(){
        let crntshape=this;
        while(crntshape.parent!=undefined){
            crntshape=crntshape.parent;
        }
        return crntshape.getHookerElement();
    }
    getRoot(root){
        if(root==undefined) root=this.parent;
        if(root==undefined) return this;
        this.getRoot(root);
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
        if(this.strokes==undefined) this.strokes=[];
        let ref=this;
        if(idx==undefined){
            this.path.map(function(shape,i){
                ref.strokes[i]=color;
                ref.addParameter("stroke",color,shape);
            });
        }else{
            ref.strokes[idx]=color;
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

    setMainOrigin(clr){
        if(clr==true){
            this.morigin=undefined;
            return;
        }
        let reference=this.getHookerGroup().getBBox();
        let cx=reference.x+reference.width/2;
        let cy=reference.y+reference.height/2;
        this.morigin={};
        this.morigin.x=cx;
        this.morigin.y=cy;
    }
    rotateAll(theta,morigin){
        let center=morigin;
        if(center==undefined) center=this.morigin;
        let ref=this;
        let allPaths=[];
        this.getPaths().forEach(function(path){
           let p=path.getAttribute("d");
           let s=new SVGPathCommander(p).transform({rotate:[theta*180/3.1416],origin:[center.x,center.y]}).toString();
           allPaths.push(s);
        });
        if(this.child!=undefined){
            this.child.rotateAll(theta,center);
        }
        this.updatePath(allPaths);
        this.callEvents("rotate")
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
            if(sd==false ||!willUpdate||sd.match(NaN)!=null||sd.match(Infinity)!=null) {willUpdate=false;return false;}
            allD.push(sd);
        });
        if(willUpdate){
            if(this.child!=undefined){
                let k=this.child.scaleAll(dx,dy,handle,true);
                if(k){
                    this.updatePath(allD);
                    return true;
                }else{
                    return false;
                }
            }else{
                this.updatePath(allD);
                return true;
            }
        }
        return false;
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
        let bbox=this.getHookerGroup().getBBox();
        let w=bbox.width;
        let h=bbox.height;
        let x=bbox.x;
        let y=bbox.y;
        this.previousPath=d;
        let ref=this;
        let eBbox=this.getHookerElement().getBBox();
        function shiftx(dx){
            let t=eBbox.x;
            let c=eBbox.x+eBbox.width;
            let tx=(t)*(1-dx/w);
            let tc=(c)*(1-dx/w);
            if(tx>tc){
                return false;
            }
            return true;
        }
        if(!shiftx(dx)) return false;

        function shifty(dy){
            let t=eBbox.y
            let c=eBbox.y+eBbox.height;
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
        if(b.width<1||b.height<1){
            return false;
        }
        return pathData;
    }

    mirrorAll(vertical=false,pos){
        if(pos==undefined) pos=this.getBBox();
        let shape=this.getPaths();
        let allPaths=[]
        shape.forEach(function(path,idx){
            let d=path.getAttribute("d");
            let options={rotate:(vertical?[0,180,180]:[180,0,180]),origin:[pos.x+pos.width/2,pos.y+pos.height/2]};
            let s=new SVGPathCommander(d).transform(options).toString();
            allPaths.push(s);
        });
        if(this.child!=undefined){
            this.child.mirrorAll(vertical,pos);
        }
        this.updatePath(allPaths);
    }

    getParant(){
        if(this.parent==undefined) return this;
        return this.parent.getParant();
    }
    
    /**
     * moveAll will move whole shape to a new position along x and y axis.
     * @param {Number} dx Shift along x axis.
     * @param {Number} dy Shift along y axis.
     * @param {Boolean} ignoreEvents Ignore all bounded events, default false
     */
    moveAll(dx,dy,data={}){
        if(this.parent!=undefined&&data.byParant!=true) return;
        let ref=this;
        let allD=[];
        this.path.map(function(shape){
            let d=shape.getAttribute("d");
            let sd=ref.move(dx,dy,d);
            allD.push(sd);
        });
        if(this.child!=undefined) this.child.moveAll(dx,dy,{"byParant":true});
        ref.updatePath(allD);
        this.getParant().handleManager.showHandles();
        this.callEvents("move",{"dx":dx,"dy":"dy","data":data});
    }
    /**
     * move will move specific path string to a new position along x and y axis.
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
    addFactory(factory){
        this.factory=factory;
    }
    /**
     * Set or get current selection state.
     * @param {boolean} value set the selection state
     * @returns boolean-current selection state
     */
    selected(value,event){
        if(this.isSelected==undefined) this.isSelected=false;
        if(value!=undefined){
            let temp=this.isSelected;
            this.isSelected=value;
            if(temp!=value){
                if(event!=undefined)this.selectedWithCtrl=event.ctrlKey;
                this.callEvents("select",event);
            }
            if(value==true){
                this.factory.selectionAdapter.addShape(this);
            }else{
                this.factory.selectionAdapter.removeShape(this);
            }
            if(this.child!=undefined) this.child.selected(value,event);
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
     * Removes a function from the event listener.
     * @param {String} name Name of the event
     * @param {Function} fn Function reference.
     */
    removeEventListener(name,fn){
        if(!Array.isArray(this.events)&&!Array.isArray(this.events[name])) return false;
        this.events[name]=this.events[name].filter(function(f){
            return f.toString()!=fn.toString();
        });
    }
    /**
     * Call the associated events
     * @param {string} name Event name.
     */
    callEvents(name,e){
        if(this.events[name]==undefined) this.events[name]=[];
        let ref=this;
        this.events[name].forEach(function(f){
            f(ref,e);
        })
    }
    /**
     * Save the shape as string.
     */
    save(){
        let saves=[];
        saves["group"]=this.getHookerElement().toString();
    }
    /**
     * delete the shape
     * @returns true if success.
     */
    delete(){
        this.selected(false);
        this.getHookerGroup().remove();
        return true;
    }

}