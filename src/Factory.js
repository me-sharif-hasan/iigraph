class Factory{
    allShapes=[];
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
            case "rect":
                shape=new Rect(this.canvas);
            break;
            case "human":
                shape=new Human(this.canvas);
            break;
            case "cloud":
                shape=new Cloud(this.canvas);
            break;
        }
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
}