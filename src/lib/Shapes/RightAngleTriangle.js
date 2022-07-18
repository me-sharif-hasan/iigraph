class RightAngleTriangle extends Path{
    constructor(canvas){
        super(canvas);
        this.createCloud();
    }
    createCloud(){
        this.addPath("M524.356,217.356H370V64L524.356,217.356Z");
        this.fill("white");
        this.stroke("black")
        this.strokeWidth(4);
    }
}