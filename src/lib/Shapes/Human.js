class Human extends Path{
    constructor(canvas){
        super(canvas);
        this.createHuman();
    }
    createHuman(){
        this.updatePath("M 70 -3 m -50, 0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0 M 70 47.5 L 70 126.67 M 70 63.33 L 0 63.33 M 70 63.33 L 140 63.33 M 70 126.67 L 0 190 M 70 126.67 L 140 190");
        this.fill("white");
        this.stroke("black")
        this.strokeWidth(5);
    }
}