class iimise{
    element={
        els:[],
        addEventListener:function(evtname,fn,flag){
            this.els.forEach(function(e){
                e.addEventListener(evtname,fn,flag);
            })
        },
        removeEventListener:function(evtname,fn,flag){
            this.els.forEach(function(e){
                e.removeEventListener(evtname,fn,flag);
            })
        }
    }
    constructor(element){
        if(!Array.isArray(element)) element=[element];
        this.element.els=element;
    }
    /**
     * Will set a event listener
     * @param {string/ string[]} eventName Name of the event(s).
     * @param {Function(event)/Function(event)[]} functionName The handler function(s).
     * @param {Function(event)/Function(event)[]} data which will pass to the function(s).
     * @param {boolean} flag Flag
     */
    on(eventName,functionName,flag,data){
        if(!Array.isArray(eventName)) eventName=[eventName];
        if(!Array.isArray(functionName)) functionName=[functionName];
        // if(!Array.isArray(flag)) flag=[flag];
        // if(!Array.isArray(data)) flag=[data];
        let ref=this;   
        eventName.forEach(function(evt){
            functionName.forEach(function(fn){
                if(evt=="drag") ref.createDragEvent(fn,flag,data);
                else if(evt=="group") ref.createGroupEvent(fn,flag,data);
                else if(evt=="ungroup") ref.createUngroupGroupEvent(fn,flag,data);
                else if(evt=="delete") ref.createDeleteEvent(fn,flag,data);
                else{
                    ref.element.addEventListener(evt,fn,flag);
                }
            });
        });
        return this;  
    }

    /**
     * Will remove a event listener
     * @param {string/ string[]} eventName Name of the event(s).
     * @param {Function(event)/Function(event)[]} functionName The handler function(s).
     * @param {boolean} flag Flag
     */
    unset(eventName,functionName,flag){
        let ref=this;
        if(!Array.isArray(eventName)) eventName=[eventName];
        if(!Array.isArray(functionName)) functionName=[functionName];
        eventName.forEach(function(evt){
            functionName.forEach(function(fn){
                ref.element.removeEventListener(evt,fn,flag);
            });
        });
        return this;
    }
    captureClick(elm){
        let clickCapture=function(e){
            e.stopPropagation();
            $(elm).unset("click",clickCapture,true);
        }
        $(elm).on("click",clickCapture,true);
    }
/**
 * 
 * @param {Function} functionName The callback function.
 * @param {boolean} flag Flag.
 * @param {*} data Data that will passed to the even variable.
 */
    createDragEvent(functionName,flag,data){
        let ref=this;
        this.on("mousedown",function(mousedown){
            if(mousedown.buttons!=1) return;
            let dragEvent={};
            dragEvent["mousedown"]=mousedown;
            dragEvent["dragstart"]={"x":mousedown.clientX,"y":mousedown.clientY};
            dragEvent["difference"]={"dx":0,"dy":0};
            dragEvent["data"]=data;
            dragEvent["mouseMoved"]=false;

            let sx=mousedown.clientX;
            let sy=mousedown.clientY;
            let mouseMoveHandler=function(mousemove){
                dragEvent["difference"]={"x":sx-mousemove.clientX,"y":sy-mousemove.clientY};
                sx=mousemove.clientX;
                sy=mousemove.clientY;
                dragEvent["mousemove"]=mousemove;
                functionName(dragEvent);
                dragEvent["mouseMoved"]=true;
            }
            let wmv = $(window).on("mousemove",mouseMoveHandler,flag);
            let mouseUpHandler=function(mouseup){
                if(dragEvent["mouseMoved"]) ref.captureClick(window);
                wmv.unset("mousemove",mouseMoveHandler,flag);
                wmv.unset("mouseup",mouseUpHandler,flag);
                dragEvent["mouseup"]=mouseup;
                functionName(dragEvent);
            }

            wmv.on("mouseup",mouseUpHandler,flag);

        })
    }

    createGroupEvent(fn,flag,data){
        $(window).on("keydown",function(e){
            if(e.ctrlKey&&e.key.toUpperCase()=="G"&&!e.shiftKey){
                e.preventDefault();
                fn(e,data);
                return false;
            }
        })
    }
    createUngroupGroupEvent(fn,flag,data){
        $(window).on("keydown",function(e){
            if(e.ctrlKey&&e.key.toUpperCase()=="G"&&e.shiftKey){
                e.preventDefault();
                fn(e,data);
                return false;
            }
        })
    }
    createDeleteEvent(fn,flag,data){
        $(window).on("keydown",function(e){
            if(e.key.toUpperCase()=="DELETE"){
                e.preventDefault();
                fn(e,data);
                return false;
            }
        })
    }
}
/**
* iimise
* @param {HTML/ SVG DOM} element 
* @returns iimise mouse action manager
*/
$=function(element){
    return new iimise(element);
}