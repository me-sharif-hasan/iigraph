class Shape{
  constructor(canvas,shapeName){
    this.base=canvas;
    this.shapeName=shapeName;
    this.resizing=false;
    this.shape=this.createSVGDOM();
    this.create();
    this.initDefault();

    let bbox=this.base.getClientRects()[0];
    this.canvasWidth=bbox.width;
    this.canvasHeight=bbox.height;
    this.canvasX=bbox.left;
    this.canvasY=bbox.top;
    this.currentInteraction=undefined;
    this.positionManager=new PositionerFactory(this);
    this.borderManager=new BorderManagerFactory(this);
    this.resizeManager=new ResizerFactory(this); //have to call after border creation
  }
  create(svgDOM){
      this.base.appendChild(svgDOM==undefined?this.shape:svgDOM);
  }
  getSVGShape(){
    return this.shape;
  }
  getSVGBorder(){
    return this.border;
  }
  getPlane(){
    return this.base;
  }
/* Handles manager calles instead of directly calling them*/
  isResizing(flag){
    if(flag!=undefined) this.resizing=flag;
    return this.resizing;
  }
  highlightBorder(flag){
    if(this.borderManager!=undefined){
      this.borderManager.highlightBorder(flag);
    }else{
      console.log("No border manager found");
    }
  }
  resizerControlCircleInit(circle){
    if(this.resizeManager!=undefined){
      return this.resizeManager.resizerControlCircleInit(circle);
    }else{
      console.log("No resize manager found");
    }
  }

  initDefault(){
    this.addParameter("fill","#ff00ff");
    this.addParameter("stroke","#868686");
    this.addParameter("stroke-width",1);
    this.addParameter("style","pointer-events:all;")
  }
  createSVGDOM(customShape){
    let shape=document.createElementNS("http://www.w3.org/2000/svg", (customShape==undefined?this.shapeName:customShape));
    return shape;
  }
  addParameter(key,value,obj){
    (obj==undefined?this.shape:obj).setAttributeNS(null, key, value);
  }
  updateParameter(key,value){
    if(this.shape.hasAttribute(key)){
      this.shape.setAttributeNS(null, key, value);
    }
  }
}
