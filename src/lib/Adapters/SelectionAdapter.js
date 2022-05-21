class SelectionAdapter{
    constructor(factory){
        this.factory=factory;
        this.__init__();
    }
    __init__(){
        let ref=this;
        let factory=this.factory;
        let rect=undefined;
        let w=0,h=0;
        $(factory.canvas).on("drag",function(e){
            if(e.mouseup&&rect!=undefined){
                ref.processSelected(rect.getBBox());
                rect.remove();
                rect=undefined;
                w=h=0;
                return;
            }
            if(!e.mousedown.target.isEqualNode(ref.factory.canvas)) return;
            if(e.mousemove==undefined||!factory.canvas.contains(e.mousemove.target)) return;
            if(rect==undefined){
                rect=document.createElementNS("http://www.w3.org/2000/svg","polygon")
                rect.setAttributeNS(null,"class","selection-rect drag-selector");
                factory.canvas.appendChild(rect);
            }
            if(e.mousemove!=undefined){
                let s=e.mousedown.layerX+","+e.mousedown.layerY;
                s+=" "+e.mousedown.layerX+","+e.mousemove.layerY;
                s+=" "+e.mousemove.layerX+","+e.mousemove.layerY;
                s+=" "+e.mousemove.layerX+","+e.mousedown.layerY;
                rect.setAttributeNS(null,"points",s);
            }
        });
        $(window).on("click",function(e){
            if(!ref.factory.canvas.contains(e.target)) return;
            if(ref.selectionMarker!=undefined){
                ref.selectionMarker.remove();
                ref.selectionMarker=undefined;
                if(ref.selectedShapes!=undefined){
                    ref.selectedShapes.forEach(function(shape){
                        shape.selected(false);
                        ref.selectedShapes=undefined;
                    })
                }
            }
        });
    }

    /**
    * This method select shapes inside the selection and return a box.
    * @param {BoundingBox} box Bounding box of the selection.
    * @returns Cordinates
    */
    getSelection(box){
        let shapes=[];
        this.factory.allShapes.forEach(function(elm){
            let bbox=elm.getHookerElement().getBBox();
            if(bbox.x>=box.x&&bbox.y>=box.y&&bbox.width+bbox.x<=box.x+box.width&&bbox.height+bbox.y<=box.height+box.y){
                elm.selected(true);
                shapes.push(elm);
            }
        });
        return shapes;
    }

    /**
     * getSelectionBounds take a shaps are return combined bounding box.
     * @param {Path[]} shapes Shape.
     * @returns return Object.
     */
    getSelectionBounds(shapes){
        let xm=9999999999,xM=0;
        let ym=9999999999,yM=0;
        shapes.forEach(function(elm){
            let bbox=elm.getHookerElement().getBBox();
            xm=Math.min(bbox.x,xm);
            xM=Math.max(bbox.x+bbox.width,xM);
            ym=Math.min(bbox.y,ym);
            yM=Math.max(bbox.y+bbox.height,yM);
        });
        return {"x1":xm,"y1":ym,"x2":xM,"y2":yM};
    }

    processSelected(box){
        this.selectedShapes=this.getSelection(box);
        box=this.getSelectionBounds(this.selectedShapes);
        if(this.selectionMarker!=undefined){
            this.selectionMarker.remove();
        }
        if(box.x2>0&&box.y2>0){
            this.selectionMarker=document.createElementNS("http://www.w3.org/2000/svg","polygon")
            this.selectionMarker.setAttributeNS(null,"class","selection-rect");
            let markerFor={};
            this.selectedShapes.forEach(function(shape){
                markerFor[shape.name]=true;
            });
            this.selectionMarker.setAttributeNS(null,"data-markerfor",JSON.stringify(markerFor));
            let s=box.x1+","+box.y1+" "+box.x1+","+box.y2+" "+box.x2+","+box.y2+" "+box.x2+","+box.y1;
            this.selectionMarker.setAttributeNS(null,"points",s);
            this.factory.canvas.appendChild(this.selectionMarker);
            let ref=this;
            $(ref.selectionMarker).on("drag",function(e){
                ref.selectedShapes.forEach(function(shape){
                    shape.allowHandle(false);
                    shape.moveAll(e.difference.x,e.difference.y);
                    box=ref.getSelectionBounds(ref.selectedShapes);
                    let s=box.x1+","+box.y1+" "+box.x1+","+box.y2+" "+box.x2+","+box.y2+" "+box.x2+","+box.y1;
                    ref.selectionMarker.setAttributeNS(null,"points",s);
                });
                if(e.mouseup!=undefined){
                    ref.selectedShapes.forEach(function(shape){
                        shape.allowHandle(true);
                    });
                }
            });
        }
    }
}