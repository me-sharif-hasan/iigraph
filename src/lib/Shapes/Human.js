class Human extends Path{
    constructor(canvas){
        super(canvas);
        this.createHuman();
    }
    createHuman(){
        this.addPath("M 476, 147 a 44,25 0 1,0 1,0 z");
        this.addPath("M 460, 163 a 10,6 0 1,0 1,0 z");
        this.addPath("M 494, 163 a 10,6 0 1,0 1,0 z");
        this.fill("white");
        this.addPath("M477,198.92618816527073L477,259.5253010997427M477,211.04294903116312L431,211.04294903116312M477,211.04294903116312L523,211.04294903116312M477,259.5253010997427L431,307.99999886581634M477,259.5253010997427L523,307.99999886581634");
        this.stroke("black")
        this.strokeWidth(4);
    }
}