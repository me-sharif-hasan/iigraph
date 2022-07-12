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
    }
    addShape(shape){
        if(this.selectedShapes==undefined) this.selectedShapes=[];
        if(!this.selectedShapes.includes(shape)){
            this.selectedShapes.push(shape);
            shape.handleManager.showHandles();
        }
        if(this.selectionMarker!=undefined){
            this.processSelected();
        }
    }
    removeShape(shape){
        if(this.selectedShapes!=undefined){
            this.selectedShapes=this.selectedShapes.filter(function(val){
                if(shape==val){
                    shape.handleManager.removeHandles();
                }
                return shape!=val;
            });
        }
    }
    deselect(){
        let ref=this;
        if(ref.selectionMarker!=undefined){
            ref.selectionMarker.remove();
            ref.selectionMarker=undefined;
        }
        if(ref.selectedShapes!=undefined){
            ref.selectedShapes.forEach(function(shape){
                shape.selected(false);
            });
            ref.selectedShapes=undefined;
        }
    }

    /**
    * This method select shapes inside the selection and return a box.
    * @param {BoundingBox} box Bounding box of the selection.
    * @returns Cordinates
    */
    getSelection(box){
        this.factory.allShapes.forEach(function(elm){
            let bbox=elm.getHookerElement().getBBox();
            if(bbox.x>=box.x&&bbox.y>=box.y&&bbox.width+bbox.x<=box.x+box.width&&bbox.height+bbox.y<=box.height+box.y){
                elm.selected(true);
            }
        });
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
        if(box!=undefined) this.getSelection(box);
        if(this.selectedShapes==undefined) return;
        this.selectedShapes.map(function(shape){
            shape.selectedWithCtrl=true;
        });
    }
}