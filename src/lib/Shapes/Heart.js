class Heart extends Path{
    constructor(canvas){
        super(canvas);
        this.createHeart();
    }
    createHeart(){
        this.updatePath("M400.52317,200c0,0 -87.63504,-64 -93.54303,-84c-5.90798,-20 8.86197,-80 41.35586,-62c32.49389,18 57.11048,48 57.11048,48c0,0 43.32519,-51 54.15649,-52c10.8313,-1 48.24851,28 36.43255,59c-11.81596,31 -95.51235,91 -95.51235,91z");
        this.fill("red");
    }
}