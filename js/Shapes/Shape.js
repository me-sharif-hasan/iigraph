class Shape{
  static numObjs=0;
  onclickFunctions=[];
  selected=false;
  constructor(canvas,shapeName){
    this.objectId=Shape.numObjs;
    Shape.numObjs++;
    this.base=canvas;
    this.shapeName=shapeName;
    this.resizing=false;
    this.clicked=false;
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

  getEventManager(){
    if(this.eventManager==undefined) this.eventManager=new EventManager(this);
  }
  markSelected(flag){
    if(flag==undefined) return this.selected;
    this.selected=flag;
    if(this.eventlist!=undefined&&this.eventlist["select"]!=undefined){
      let selectEvents=this.eventlist["select"];
      selectEvents.forEach(function(f){
        f(this,flag);
      });
    }
  }
  getId(){
    return this.objectId;
  }
  isClicked(flag){
    if(flag!=undefined) this.clicked=flag;
    return this.clicked;
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
  getSelectionMachanism(){
    return this.selectionMachanism;
  }
/* Handles manager calles instead of directly calling them*/
  isResizing(flag){
    if(flag!=undefined) this.resizing=flag;
    return this.resizing;
  }
  highlightBorder(border,circles){
    if(this.borderManager!=undefined){
      this.borderManager.highlightBorder(border,circles);
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

  addSelectionMachanism(selector){
    if(selector instanceof SelectionMachanism){
      this.selectionMachanism=selector;
      selector.addShapeToList(this);
    }else{
      console.warn("Wrong selector machanism");
    }
    return this;
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
  addEventListener(name,fn,flag){
    if(this.eventlist==undefined) this.eventlist=[];
    if(this.eventlist[name]==undefined) this.eventlist[name]=[];
    this.eventlist[name].push(fn);
  }
}
