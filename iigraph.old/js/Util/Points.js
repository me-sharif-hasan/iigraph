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
    shiftTo(dx,dy,key){
        let ref=this;
        if(key==undefined){
            Object.keys(this.pos).forEach(function(k){
                let x=ref.get(k)["x"]-dx;
                let y=ref.get(k)["y"]-dy;
                ref.set(k,{"x":x,"y":y});
            });
        }else{
            let x=ref.get(key)["x"]-dx;
            let y=ref.get(key)["y"]-dy;
            ref.set(key,{"x":x,"y":y});
        }
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
    getMinHandSize(){
        let min=Math.pow(2,32);
        for(let i=0;i<4;i++){
            let dist=Math.sqrt(Math.pow(this.get(i).x-this.get((i+1)%4).x,2)+Math.pow(this.get(i).y-this.get((i+1)%4).y,2));
            min=Math.min(dist,min);
        }
        return min;
    }
    contains(point){
        let ref=this;
        if(this.pos.length>4){
            console.warn("Not yet implemented.");
            return false;
        }
        let flag=true;
        Object.keys(point.pos).forEach(function(key){
            let px=point.get(key).x;
            let py=point.get(key).y;
            let tmp=false;
            if(px>=ref.get(0).x&&px<=ref.get(3).x){
                if(py>=ref.get(0).y&&py<=ref.get(1).y){
                    if(px>=ref.get(1).x&&px<=ref.get(2).x){
                        if(py>=ref.get(3).y&&py<=ref.get(2).y){
                            tmp=true;
                        }
                    }
                }
            }
            flag&=tmp;
        });
        return flag;
    }
}