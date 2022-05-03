class Points{
    pos={}
    constructor(points){
        this.pos=points;
    }
    get(n){
        return this.pos[n];
    }
    set(n,point){
        this.pos[n]=point;
    }
    shiftTo(dx,dy){
        let ref=this;
        Object.keys(this.pos).forEach(function(key){
            let x=ref.get(key)["x"]-dx;
            let y=ref.get(key)["y"]-dy;
            ref.set(key,{"x":x,"y":y});
        });
    }
    forEachPoint(fn){
        let ref=this;
        Object.keys(this.pos).forEach(function (key) {
            fn(key,ref.pos[key]);
        })
    }
    getSvgPathPoints(){
        let path="";
        let ref=this;
        Object.keys(this.pos).forEach(function(key){
            path+=ref.get(key)["x"]+","+ref.get(key)["y"]+" ";
        });
        return path;
    }
}