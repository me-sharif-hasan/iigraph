class Factory{
    allShapes=[];
    events={};
    constructor(canvas){
        this.canvas=canvas;
        this.selectionAdapter=new SelectionAdapter(this);
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