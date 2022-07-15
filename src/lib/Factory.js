class Factory{
    allShapes=[];
    events={};
    constructor(canvas){
        this.canvas=canvas;
        this.selectionAdapter=new SelectionAdapter(this);
        let ref=this;
        $(window).on("group",function(e){
            let s=ref.sortShapes(ref.selectionAdapter.selectedShapes);
            if(s.length==0) return;
            if(s==undefined) return;
            for(let i=1;i<s.length;i++){
                s[i].addParent(s[i-1]);
            }
            s[0].handleManager.showHandles();
            ref.selectionAdapter.deselect();
            s[0].selected(true);
        });
        $(window).on("ungroup",function(e){
            let sorted=ref.sortShapes(ref.allShapes);
            let ps=[]
            sorted.map(function(shape){
               if(shape.selected()){
                   shape.detach();
                   ps.push(shape);
               }
            });
            ps.map(function(shape){
                shape.selected(false,{"selectedWithCtrl":true});
            });
        });
        $(window).on("delete",function(e){
            ref.selectionAdapter.selectedShapes.filter(function(shape){
                ref.allShapes.filter(function(ss){
                    return ss!=shape;
                })
                shape.delete();
                return false;
            });
        });
    }
    /**
     * Create shape based on given name.
     * @param {String} name Name of the shape.
     */
    create(name){
        let shape=null;
        switch(name){
            case "circle":
                shape=new Circle(this.canvas);
            break;
            case "heart":
                shape=new Heart(this.canvas);
            break;
            case "human":
                shape=new Human(this.canvas);
            break;
            case "cloud":
                shape=new Cloud(this.canvas);
            break;
            case "isotherm":
                shape=new Isotherm(this.canvas);
            break;
            case "rect":
                shape=new Rectangle(this.canvas);
            break;
            case "finger":
                shape=new Finger(this.canvas);
            break;
            case "rightangle-triangle":
                shape=new RightAngleTriangle(this.canvas);
            break;
            case "cube":
                shape=new Cube(this.canvas);
            break;
        }
        shape.addFactory(this);
        let ref=this;
        Object.keys(this.events).forEach(function(name){
            $(shape).on(name,ref.events[name]);
        });
        this.allShapes.push(shape);
        return shape;
    }

    /**
     * Return all shapes in a canvas.
     * @returns Path[]
     */
    getAllShapes(){
        return this.allShapes;
    }
    getselected(){
        let selected=[];
        this.allShapes.forEach(function(shape){
            if(shape.selected()){
                selected.push(shape);
            }
        });   
        return selected;    
    }
    sortShapes(shapes){
        if(shapes==undefined) return [];
        let ref=this;
        let order=[];
        Object.keys(this.canvas.childNodes).forEach(function(i){
            shapes.forEach(function(shape){
                if(ref.canvas.childNodes[i]==shape.getHookerGroup()){
                    order.push(shape);
                }
            });
        });
        return order;
    }
    selectedGoBack(){
        this.sortShapes(this.getselected()).forEach(function(shape){
            shape.toBack();
        });
    }
    selectedComeFront(){
        this.sortShapes(this.getselected()).reverse().forEach(function(shape){
            shape.toFront();
        });
    }
    moveAllSelected(dx,dy){
        if(this.selectionAdapter.selectedShapes!=undefined){
            this.selectionAdapter.selectedShapes.map(function(shape){
                shape.moveAll(dx,dy);
            });
        }
    }
    addEventListener(name,fn){
        if(this.events[name]==undefined) this.events[name]=[];
        this.events[name].push(fn);
    }
    getCtrlSelectedItems(){
        let items=[];
        this.allShapes.forEach(function(shape){
            if(shape.selectedWithCtrl){
                items.push(shape)
            }
        });
        return items;
    }

    mirrorSelected(vertical=false){
        let shapes=this.getselected();
        shapes.forEach(function(shape){
            //ignore child shapes, paranet will do the mirroring for them.
            if(shape.parent!=undefined) return;
            shape.mirror(vertical);
        });
    }

    clone(){
       // [...this.allShapes]
    }
}