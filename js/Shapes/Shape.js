class Shape{
  constructor(canvas,shapeName){
    this.base=canvas;
    this.shapeName=shapeName;
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

  highlightBorder(flag){
    if(this.borderManager!=undefined){
      this.borderManager.highlightBorder(flag);
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
