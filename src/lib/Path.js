class Path{
    constructor(canvas){
        this.canvas=canvas;
        this.__init__();
        this.addScaleAdapter(this.group);
    }
    __init__(){
        this.group=document.createElementNS("http://www.w3.org/2000/svg","g");
        this.path=document.createElementNS("http://www.w3.org/2000/svg","path");
        this.group.append(this.path);
        this.canvas.append(this.group);
    }
    addParameter(parameterName,parameterValue){
        this.path.setAttributeNS(null, parameterName, parameterValue);
    }
    
    /**
    * updatePath
    * @param {string} path - path for SVG path
    */
    
    updatePath(path){
        this.addParameter("d",path);
    }
    addScaleAdapter(){
        this.scaleAdapter=new ScaleAdapter(this.getHookerElement());
    }
    /**
     * 
     * @returns Returns the current group.
     */
    getHookerElement(){
        return this.group;
    }

}