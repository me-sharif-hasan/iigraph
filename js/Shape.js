class Shape{
  positionHandler=undefined;
  constructor(canvas,shapeName){
    this.base=canvas;
    this.shapeName=shapeName;
    this.createSVGDOM();
    this.initDefault();

    let bbox=this.base.getClientRects()[0];
    this.canvasWidth=bbox.width;
    this.canvasHeight=bbox.height;
    this.canvasX=bbox.left;
    this.canvasY=bbox.top;
    this.currentInteraction=undefined;
    this.positionHandler=new Positioner(this);
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

  initDefault(){
    this.addParameter("fill","#ff00ff");
    this.addParameter("stroke","#868686");
    this.addParameter("stroke-width",1);
    this.addParameter("style","pointer-events:all;")

    this.borderWidth=2;
    this.updateBorder("stroke-width","0");
    this.updateBorder("pointer-events","stroke");
    this.updateBorder("cursor","crosshair");
    this.addEventListeners();
    this.addBorderEventListeners();
  }
  createSVGDOM(){
    this.shape=document.createElementNS("http://www.w3.org/2000/svg", this.shapeName);
    this.border=document.createElementNS("http://www.w3.org/2000/svg", this.shapeName);
    this.base.appendChild(this.shape);
    this.base.appendChild(this.border);
  }
  addParameter(key,value){
    this.shape.setAttributeNS(null, key, value);
  }
  updateParameter(key,value){
    if(this.shape.hasAttribute(key)){
      this.shape.setAttributeNS(null, key, value);
    }
  }
  updateBorder(key,value){
    this.border.setAttributeNS(null,key,value);
  }
  resetMouse(){
    this.updateBorder("cursor","default");
    this.addParameter("cursor","default");
    this.updateBorder("stroke-width","0");
  }
  addEventListeners(){
    return;
    let shape=this;
    shape.shape.onmousedown=function (e){
      shape.currentInteraction=shape.shape;
      let ix=e.layerX;
      let iy=e.layerY;

      shape.base.onmousemove=shape.shape.onmousemove=function(e){
        if(shape.currentInteraction!=undefined){
          e.dx=e.layerX-ix;
          e.dy=e.layerY-iy;
          ix=e.layerX;
          iy=e.layerY;
          shape.addParameter("cursor","move");
          shape.updatePosition(e);
        }
      }
    }
    shape.shape.onmouseup=function(e){
      shape.currentInteraction=undefined;
      shape.base.onmousemove=shape.shape.onmousemove=shape.border.onmousemove=undefined;
      shape.resetMouse();
    }
    shape.shape.onmouseover=function(e){
      shape.updateBorder("stroke-width",10);
    }
    shape.shape.onmouseout=function(e){
      if(shape.shape.onmousemove!=undefined)
        shape.updateBorder("stroke-width",0);
    }
  }
  addBorderEventListeners(){
    let shape=this;
    shape.border.onmouseover=function(e){
      shape.updateBorder("stroke-width",10);
      shape.updateBorder("cursor","crosshair");
    }
    shape.border.onmouseout=function(e){
      if(shape.border.onmousemove==undefined)
        shape.updateBorder("stroke-width",0);
        shape.updateBorder("cursor","default");
    }
    shape.border.onmousedown=function(e){
      shape.currentInteraction=shape.border;
      let ix=e.layerX;
      let iy=e.layerY;
      let sx=ix,sy=iy;
      shape.base.onmousemove=shape.border.onmousemove=function(e){
      if(shape.currentInteraction!=undefined){
        e.dx=e.layerX-ix;
        e.dy=e.layerY-iy;
        e.sx=sx;
        e.sy=sy;
        ix=e.layerX;
        iy=e.layerY;
        shape.updateDimension(e);
      }
    }

    }
    shape.base.onmouseup=shape.border.onmouseup=shape.shape.onmouseup=function(e){
        shape.currentInteraction=undefined;
        shape.base.onmousemove=shape.shape.onmousemove=shape.border.onmousemove=undefined;
        shape.resetMouse();
    }

  }
}
