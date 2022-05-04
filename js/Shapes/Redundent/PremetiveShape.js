class PremetiveShape extends Shape{
    constructor(canvas,shapename){
        super(canvas,shapename);
        this.jumpHandler=undefined;
    }
    createPoints(){
        let ref=this;
        Object.keys(this.params).forEach(function(key){
            ref.addParameter(key,ref.params[key]);
        });
        this.borderManager.getManager().redraw();
    }
    set(key,value){
        if(this.params==undefined){
            this.params={};
        }
        this.params[key]=value;
    }
    get(n){
        return this.params[n];
    }
    setJumpHandler(fn){
        this.jumpHandler=fn;
    }
    jump(dx,dy){
        if(this.jumpHandler==undefined){
            console.warn("No jump handler implemented! Please add a jump handler in "+this.constructor.name+" using setJumpHandler");
            return;
        }
        this.jumpHandler(dx,dy);
    }
}