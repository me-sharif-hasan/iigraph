class Path{
    constructor(canvas){
        this.canvas=canvas;
        this.__init__();
    }
    __init__(){
        this.path=document.createElementNS("http://www.w3.org/2000/svg","path");
        this.canvas.append(this.path);
    }
    addParameter(parameterName,parameterValue){
        this.path.setAttributeNS(null, parameterName, parameterValue);
    }
}