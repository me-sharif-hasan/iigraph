class Circle extends Path{
    constructor(canvas){
        super(canvas);
        this.createCircle();
    }
    /**
     * createCircle - Initiate a circle.
     */
    createCircle(){
        let cx=300;
        let cy=170;
        let R=100;
        let cmd=this.circlePath(cx,cy,R);
        this.addPath(cmd);
        this.fill("red",1);
        this.stroke("black");
    }
    /**
     * CirclePath - Create SVG path for a circle by the given information.
     * @param {number} cx - x cordinate of the center 
     * @param {number} cy - y cordinate of the center
     * @param {number} r -radius of the circle
     * @returns circle path string
     */
    circlePath(cx, cy, r){
        return 'M '+cx+' '+cy+' m -'+r+', 0 a '+r+','+r+' 0 1,0 '+(r*2)+',0 a '+r+','+r+' 0 1,0 -'+(r*2)+',0';
    }

    /**
     * 
     * @param {Number} dx - change of mouse pointer along x axis. 
     * @param {*} dy - change of mouse pointer along y axis.
     * @param {*} handle - handle id.
     */
    doScalling(dx,dy,handle){

    }
}