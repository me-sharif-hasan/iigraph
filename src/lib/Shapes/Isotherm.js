class Isotherm extends Path{
    constructor(canvas){
        super(canvas);
        this.createIsotherm();
    }
    createIsotherm(){
        this.addPath(`M34.186,424.409L240.276,68.585l206.091,355.824H34.186L34.186,424.409z`);
        this.stroke("black")
        this.fill("transparent")
        this.strokeWidth(4);
    }
}