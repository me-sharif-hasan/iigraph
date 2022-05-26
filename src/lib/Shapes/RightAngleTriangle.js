class RightAngleTriangle extends Path{
    constructor(canvas){
        super(canvas);
        this.createCloud();
    }
    createCloud(){
        this.addPath("M383,247.35599237741803h154.3560063056333V94L383,247.35599237741803z");
        this.fill("transparent");
        this.stroke("black")
        this.strokeWidth(4);
    }
}