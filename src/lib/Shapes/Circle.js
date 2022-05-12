class Circle extends Path{
    constructor(canvas){
        super(canvas);
        this.createCircle();
    }
    /**
     * createCircle - Initiate a circle.
     */
    createCircle(){
        let cx=200;
        let cy=300;
        let R=50;
        let cmd=this.circlePath(cx,cy,50);
        this.updatePath(cmd);
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