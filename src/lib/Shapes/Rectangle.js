class Rectangle extends Path{
    constructor(canvas){
        super(canvas);
        this.createRect();
    }
    createRect(){
        this.addPath(`M349,227.99999999999997h212.00000000000028v-132.99999999999991h-212.00000000000028v132.99999999999991`);
        this.stroke("black")
        this.fill("white")
        this.strokeWidth(4);
    }
}