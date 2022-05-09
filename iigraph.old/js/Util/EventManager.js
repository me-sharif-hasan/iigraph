class EventManager{
    constructor(dom){
        let ref=this;
        if(!Array.isArray(dom)){
            dom=[dom];
        }
        this.dom=dom;
    }
    on(name,fn,flag){
        this.dom.forEach(function(elm){
            name.split(" ").forEach(function(ename){
                if(ename!="") elm.addEventListener(ename,fn,flag);
            });
        });
    }
    unbind(name,fn,flag){
        this.dom.forEach(function(elm){
            name.split(" ").forEach(function(ename){
                if(ename!="") elm.removeEventListener(ename,fn,flag);
            });
        });        
    }
}

$=function(dom){
    return new EventManager(dom);
}