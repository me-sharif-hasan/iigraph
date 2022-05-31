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
            s[0].scaleAdapter.showHandles();
            ref.selectionAdapter.deselect();
            s[0].selected(true);
        });
        $(window).on("ungroup",function(e){
            ref.allShapes.map(function(shape){
                if(shape.parent!=undefined&&shape.selected()){
                    shape.detach();
                    shape.scaleAdapter.showHandles();
                }
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
                console.log(shape);
            break;
            case "finger":
                shape=new Finger(this.canvas);
            break;
            case "rightangle-triangle":
                shape=new RightAngleTriangle(this.canvas);
            break;
        }
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
                if(ref.canvas.childNodes[i]==shape.getHookerElement()){
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
    addEventListener(name,fn){
        if(this.events[name]==undefined) this.events[name]=[];
        this.events[name].push(fn);
    }
}