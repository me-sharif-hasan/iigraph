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
    }
    /**
     * 
     * @param {string} parameterName Name of the parameter.
     * @param {*} parameterValue Value of the parameter.
     * @param {SVGElement} element SVG element. If undefined then path itself will be considered.
     */
    addParameter(parameterName,parameterValue,element){
        (element==undefined?this.path:element).setAttributeNS(null, parameterName, parameterValue);
    }
    
    /**
    * updatePath
    * @param {string} path - path for SVG path
    */
    
    updatePath(path){
        this.addParameter("d",path);
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
    fill(color){
        this.addParameter("fill",color);
    }

}